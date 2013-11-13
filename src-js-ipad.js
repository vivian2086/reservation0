
var selectedStore_g         = null;
var storeName_g             = null;
var partNumber_g            = null;
var skuName_g               = null;
var timeslotid_g            = null;
var timeSlotStartTime_g     = null;         //jQuery('#hiddenTimeSlot').val().split(',')[2];
var pickUpSlot_g            = null;         //jQuery('.step-seven .selection').html()
var plan_g                  = "UNLOCKED";   //jQuery('.carrier-row').find(' input ').val();     
var selectedSubProduct_g    = 'iPad mini with Retina display';
var pickupMode_g            = 'POST_LAUNCH';

function van_getTimeslots() {
    var timeslots = [];
    var startime_tmp = null;
	var dataString = 'productName=' + selectedSubProduct_g + '&storeNumber=' + selectedStore_g +'&plan='+ plan_g + '&mode=' + pickupMode_g;
    var i = 0;
    
    console.log( '<2>. 计算取机时间...' );
    jQuery.ajax({
                type: "POST",
                async: false,
                url: "getTimeSlots",
                dataType : "json",
                data: dataString,
                success: function(data) {
                if (data.timeSlots != null) {
                
                console.log( "POST(gettimeslots) success1" );
                timeslots = data.timeSlots;	
                for( i = startime_g; i < 24 && timeslotid_g == null; i++ ){
                
                if( i < 12 )
                    startime_tmp = i + ':00 上午';
                else if( i == 12 )
                    startime_tmp = '12:00 下午';
                else
                    startime_tmp = i%12 + ':00 下午';
                
                jQuery.each(timeslots, function(index, val) {
                            console.log( "      " + val.formattedTimeForDisplay + ": " + val.timeslotID + ', '  + val.startTime );
                            
                            if( val.formattedTimeForDisplay.split(' - ')[0] == startime_tmp ){
                            timeSlotStartTime_g = val.startTime;
                            timeslotid_g = val.timeslotID;
                            pickUpSlot_g = val.formattedTimeForDisplay;
                            
                            console.log( "              确定取机时间. " + pickUpSlot_g + ": " + timeslotid_g + ', ' + timeSlotStartTime_g + ', available:' + val.reservationAvailable );
                            return false;
                            } 
                            });
                
                }//for
                } 
                console.log( "POST(gettimeslots) success2" );
                },
                error: function () {
                console.log( "POST(getTimeSlots) error" );
                } 		
                
                
                });
    
    
    
    if( timeslotid_g == null )
        return false;
    else
        return true;
}


function van_onSubmitRequest() {
    var quantity        = 1;                           //parseInt(jQuery('.step-five .selection').html());
    
    
    var dataString = {emailAddress:emailAddress_g, firstName:firstName_g, lastName:lastName_g, phoneNumber:phoneNumber_g, storeNumber:selectedStore_g, partNumber:partNumber_g, pickUpMode:pickupMode_g, timeSlotId:timeslotid_g, plan:plan_g, productName:selectedSubProduct_g, quantity:quantity, govtID:governmentID_g, startTime:timeSlotStartTime_g, skuName:skuName_g, pickUpSlot:pickUpSlot_g};
    
    console.log( '<3>. 提交订单...' );

    jQuery.ajax({
                type : "POST",
                url : "createPickUp",
                dataType : "json",
                contentType: "application/json",
                data : JSON.stringify(dataString)
                }).done(function(data){
                        if (data != null) {
                        if (data.isError) {
                        if(data.loginRedirectUrl) {
                        window.location = data.loginRedirectUrl;
                        console.log( "POST(createPickUp) error1: loginRedirectUrl" );
                        } else {
                        console.log( "POST(createPickUp) error2: " + data.errorMessage );
                        jQuery("#error").show();
                        jQuery("#errorMessage").parent().show();
                        jQuery("#errorMessage").text(data.errorMessage);
                        jQuery("#errMessage").hide();		
                        jQuery("#errorMessage").show();
                        //Clear Captcha 
                        CaptchaProcess.getCaptcha();
                        }
                        } else {
                        
                        var stitle3 = null;
                        stitle3 = "HK$ 5,588";
                        
                        console.log( "POST(createPickUp) success" );
                        jQuery('#productName').val(quantity + " " + skuName_g);   //
                        jQuery('#pickupMode').val(pickupMode_g);       //(pickupMode_g);  
                        jQuery('#pickUpSlot').val(pickUpSlot_g);     //(jQuery('.step-seven .selection').html());
                        jQuery('#storeName').val(storeName_g);        //(jQuery('.step-one .selection').html());
                        jQuery('#pickupDateAndTimeText').val(data.pickupDateAndTimeText);
                        jQuery('#storeMapUrl').val(data.storeMapUrl);
                        jQuery('#tagName').val(location.href.split('/')[location.href.split('/').length - 2]);
                        jQuery('#pickUpForm').submit();
                        }
                        }
                        
                        }).fail(function(jqXHR, textStatus, errorThrown) {
                                console.log( "POST(createPickUp) error3: fail" );
                                console.error(jqXHR, textStatus, errorThrown);
                                //Clear Captcha 
                                CaptchaProcess.getCaptcha();
                                }).always(function() {
                                          });
	
}








function van_check_available( sku, partNum ) {
    
    var partNum_enabled = false;
    
    console.log( '<1>. 搜索该型号ipad...' );
    jQuery.each(sku, function(product,productData) {
        jQuery.each(productData, function(color,colorData) {	
            jQuery.each(colorData, function(sTitle1,sTitle1Data) { 
                jQuery.each(sTitle1Data, function(carrier,carrierData) { 
                    if( carrier.toLowerCase() == 'unlocked' ){
                        jQuery.each(carrierData, function(capacity,capacityData) {
                            jQuery.each(capacityData, function(index,skuData) {
				if (index === 0) {
                                    if( skuData.partNumber == partNum ){
                                        if( skuData.enabled ){
                                            console.log( '    ' + partNum + ', ' + skuData.localizedAttributes.S_SKU_NAME + ': 找到' );
                                            partNum_enabled = true;
                                            return false;
                                        }else{
                                            console.log( '    ' + partNum + ', ' + skuData.localizedAttributes.S_SKU_NAME + ': 无货' );
                                        }
                                    }	
                                }
                            });	
                        });
                    }
		});	
            });
        });
    });
    
    return partNum_enabled;
}


//向服务器请求某store的sku
function van_getsku( storeNumber ) {
    
    var sku = null;
    var tag=location.href.split('/')[location.href.split('/').length-2];
    var dataString = 'tag=' + tag + '&store=' + storeNumber + '&product=' + selectedSubProduct_g;
    
    jQuery.ajax({
        type: "POST",
        async: false,
        url: "skusForStoreProduct",
        dataType : "json",
        data: dataString,
        success: function(data) {
            if (data != null) {	
                if (data.productResponse !== undefined) {
                    sku = data.productResponse.productGroupedSku;
                    console.log('POST(sku) success: ' + storeNumber );
                } else {
    		    console.log('POST(sku) No data:' + storeNumber );
                }
            } else {
                console.log('POST(sku) data == NULL:' + storeNumber );
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log( "POST(sku) err1" );
        } 		
    }); 
    
    return sku;
};


// function van_gettime_submit(){
    
//     var i = 0;
    
//     van_getTimeslots();
    
//     (function doit() {
//      setTimeout(function() {
//                 if( timeslotid_g != null ){
//                 van_onSubmitRequest();
//                 }
//                 if( i++ < 30 && timeslotid_g == null ) {
//                 console.log( i );
//                 van_getTimeslots();
//                 doit();
//                 }
//                 }, 200 );
//      })();
// }



function van_get_apple()
{
    
    var i = 0;
    var k = 0;
    var sku     		= null;
    var stores	    = null;
    var stores_all = [ 
        { "city":"香港", "store":[ {"num":"R428", "name":"香港, ifc mall"}, {"num":"R485", "name":"香港, Festival Walk"}, {"num":"R409", "name":"香港, Causeway Bay"} ]},
        { "city":"北京", "store":[ {"num":"R320", "name":"北京市, 三里屯"}, {"num":"R448", "name":"北京市, 王府井"}, {"num":"R388", "name":"北京市, 西单大悦城"} ]},
        { "city":"上海", "store":[ {"num":"R389", "name":"上海, 浦东"}, {"num":"R359", "name":"上海, 南京东路"}, {"num":"R390", "name":"上海, 香港广场"} ]},
        { "city":"深圳", "store":[ {"num":"R484", "name":"深圳, 深圳益田假日广场"} ]},
        { "city":"成都", "store":[ {"num":"R502", "name":"成都, 成都万象城"} ]}
    ];
    
    var models = [
                  { "color":"银", "capacity":"16", "carrier":"wifi-ml", "partNum":"ME279CH/A", "skuName":"配备 Retina 显示屏的 iPad mini WLAN 16GB 机型 - 银色" },
                  { "color":"银", "capacity":"16", "carrier":"wifi-hk", "partNum":"ME279ZP/A", "skuName":"iPad mini 配備 Retina 顯示器 Wi-Fi 16GB - 銀色" },
                  { "color":"银", "capacity":"16", "carrier":"cell",    "partNum":"ME814ZP/A", "skuName":"iPad mini 配備 Retina 顯示器 Wi-Fi + Cellular 16GB - 銀色" },
                  { "color":"银", "capacity":"32", "carrier":"wifi-ml", "partNum":"ME280CH/A", "skuName":"配备 Retina 显示屏的 iPad mini WLAN 32GB 机型 - 银色" },
                  { "color":"银", "capacity":"32", "carrier":"wifi-hk", "partNum":"ME280ZP/A", "skuName":"iPad mini 配備 Retina 顯示器 Wi-Fi 32GB - 銀色" },
                  { "color":"银", "capacity":"32", "carrier":"cell",    "partNum":"ME824ZP/A", "skuName":"iPad mini 配備 Retina 顯示器 Wi-Fi + Cellular 32GB - 銀色" },
                  { "color":"银", "capacity":"64", "carrier":"wifi-ml", "partNum":"ME281CH/A", "skuName":"配备 Retina 显示屏的 iPad mini WLAN 64GB 机型 - 银色" },
                  { "color":"银", "capacity":"64", "carrier":"wifi-hk", "partNum":"ME281ZP/A", "skuName":"iPad mini 配備 Retina 顯示器 Wi-Fi 64GB - 銀色" },
                  { "color":"银", "capacity":"64", "carrier":"cell",    "partNum":"ME832ZP/A", "skuName":"iPad mini 配備 Retina 顯示器 Wi-Fi + Cellular 64GB - 銀色" },
                  { "color":"银", "capacity":"128", "carrier":"wifi-ml","partNum":"ME860CH/A", "skuName":"配备 Retina 显示屏的 iPad mini WLAN 128GB 机型 - 银色" },
                  { "color":"银", "capacity":"128", "carrier":"wifi-hk","partNum":"ME860ZP/A", "skuName":"iPad mini 配備 Retina 顯示器 Wi-Fi 128GB - 銀色" },
                  { "color":"银", "capacity":"128", "carrier":"cell",   "partNum":"ME840ZP/A", "skuName":"iPad mini 配備 Retina 顯示器 Wi-Fi + Cellular 128GB - 銀色" },
		  { "color":"灰", "capacity":"16", "carrier":"wifi-ml", "partNum":"ME276CH/A", "skuName":"配备 Retina 显示屏的 iPad mini WLAN 16GB 机型 - 深空灰色" },
                  { "color":"灰", "capacity":"16", "carrier":"wifi-hk", "partNum":"ME276ZP/A", "skuName":"iPad mini 配備 Retina 顯示器 Wi-Fi 16GB - 太空灰" },
                  { "color":"灰", "capacity":"16", "carrier":"cell",    "partNum":"ME800ZP/A", "skuName":"iPad mini 配備 Retina 顯示器 Wi-Fi + Cellular 16GB - 太空灰" },
                  { "color":"灰", "capacity":"32", "carrier":"wifi-ml", "partNum":"ME277CH/A", "skuName":"配备 Retina 显示屏的 iPad mini WLAN 32GB 机型 - 深空灰色" },
                  { "color":"灰", "capacity":"32", "carrier":"wifi-hk", "partNum":"ME277ZP/A", "skuName":"iPad mini 配備 Retina 顯示器 Wi-Fi 32GB - 太空灰" },
                  { "color":"灰", "capacity":"32", "carrier":"cell",    "partNum":"ME820ZP/A", "skuName":"iPad mini 配備 Retina 顯示器 Wi-Fi + Cellular 32GB - 太空灰" },
                  { "color":"灰", "capacity":"64", "carrier":"wifi-ml", "partNum":"ME278CH/A", "skuName":"配备 Retina 显示屏的 iPad mini WLAN 64GB 机型 - 深空灰色" },
                  { "color":"灰", "capacity":"64", "carrier":"wifi-hk", "partNum":"ME278ZP/A", "skuName":"iPad mini 配備 Retina 顯示器 Wi-Fi 64GB - 太空灰" },
                  { "color":"灰", "capacity":"64", "carrier":"cell",    "partNum":"ME828ZP/A", "skuName":"iPad mini 配備 Retina 顯示器 Wi-Fi + Cellular 64GB - 太空灰" },
                  { "color":"灰", "capacity":"128", "carrier":"wifi-ml","partNum":"ME856CH/A", "skuName":"配备 Retina 显示屏的 iPad mini WLAN 128GB 机型 - 深空灰色" },
                  { "color":"灰", "capacity":"128", "carrier":"wifi-hk","partNum":"ME856ZP/A", "skuName":"iPad mini 配備 Retina 顯示器 Wi-Fi 128GB - 太空灰" },
                  { "color":"灰", "capacity":"128", "carrier":"cell",   "partNum":"ME836ZP/A", "skuName":"iPad mini 配備 Retina 顯示器 Wi-Fi + Cellular 128GB - 太空灰" },
                  ];
    
    
    //计算城市
    jQuery.each(stores_all, function(index,cityData) {
        if( cityData.city == pickup_city_g ){
            stores = cityData.store;
            return false;
        }
    });
    
    if( stores == null ){
        console.log( '城市名错误: ' + pickup_city_g );
        return;
    }
    
    
    //计算型号
    for( i=0; i<models.length; i++ ){
        if( models[i].color == color_g &&
            models[i].capacity == capacity_g &&
            models[i].carrier == carrier_g ){
            
            partNumber_g = models[i].partNum;
            skuName_g = models[i].skuName;
            break;
        }
    }
    if( partNumber_g == null || skuName_g == null ){
        console.log( 'ipad型号错误: ' + color_g + ', ' + capacity_g + ', ' + carrier_g );
        return;
    }
    
    //尝试3次
    for( k=0; k<3; k++ ){
	for( i=0; i<stores.length; i++ ){
        console.log( Date() +  ", " +  stores[i].name );
	    sku = van_getsku( stores[i].num );
	    console.log( Date() );
        if( sku != null ){
		if( van_check_available( sku, partNumber_g ) == true ){
                    selectedStore_g         = stores[i].num;
                    storeName_g             = stores[i].name;
                    
                    //获取timeslot，然后提交
                    if( van_getTimeslots() == true ){
			van_onSubmitRequest();
			return;
		    }
		}
            }
        console.log( " " );
	}
    }
    
    
    if( sku != null )
        console.log( "预约失败: 该型号在该城市的所有直营店都没货." );
    else
        console.log( "预约失败: 服务器无响应." );
    
}

van_get_apple();

