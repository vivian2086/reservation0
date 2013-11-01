

var lastName_g = '黄';
var firstName_g = '荣杰';
var emailAddress_g = 'vivian2086@gmail.com';
var phoneNumber_g = '85290626306';
var governmentID_g = '450881198703101839';
var color_g = '金';
var capacity_g = '16';
var carrier_g = '香港';
var pickup_city_g = '香港';
var endtime_g = 9;



var selectedStore_g         = null;
var storeName_g             = null;
var partNumber_g            = null;
var skuName_g               = null;
var timeslotid_g            = null;
var timeSlotStartTime_g     = null;         //jQuery('#hiddenTimeSlot').val().split(',')[2];
var pickUpSlot_g            = null;         //jQuery('.step-seven .selection').html()
var plan_g                  = "UNLOCKED";   //jQuery('.carrier-row').find(' input ').val();     
var selectedSubProduct_g    = 'iPhone 5s';
var pickupMode_g            = 'POST_LAUNCH';

function van_getTimeslots() {
    var timeslots = [];
    var endtime_tmp = null;
	var dataString = 'productName=' + selectedSubProduct_g + '&storeNumber=' + selectedStore_g +'&plan='+ plan_g + '&mode=' + pickupMode_g;
    var i = 0;
    
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
                for( i = endtime_g; i > 0  && timeslotid_g == null; i-- ){
                endtime_tmp = i + ':00 下午';
                
                jQuery.each(timeslots, function(index, val) {
                            console.log( val.formattedTimeForDisplay + ": " + val.timeslotID + ', ' + val.timeslotDate+ ', ' + val.startTime );
                            
                            if( val.formattedTimeForDisplay.split(' - ')[1] == endtime_tmp ){
                            timeSlotStartTime_g = val.startTime;
                            timeslotid_g = val.timeslotID;
                            pickUpSlot_g = val.formattedTimeForDisplay;
                            
                            console.log( "      getTimeSlots success. " + pickUpSlot_g + ": " + timeslotid_g + ', ' + timeSlotStartTime_g + ', available:' + val.reservationAvailable );
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
                                            console.log( '    found ' + partNum + ', ' + skuData.localizedAttributes.S_SKU_NAME );
                                            partNum_enabled = true;
                                            return false;
                                        }else{
                                            console.log( '    found ' + partNum + ', ' + skuData.localizedAttributes.S_SKU_NAME + ',but not enabled' );
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



function van_get_iphone()
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
        //
        //    { "city":"北京", "store":[ "R388", "R320", "R448" ] },
        //    { "city":"上海", "store":[ "R389", "R359", "R390" ] },
        //    { "city":"深圳", "store":[ "R484" ] },
        //    { "city":"成都", "store":[ "R502" ] }
    ];
    
    var models = [ 
        { "color":"金", "capacity":"16", "carrier":"香港", "partNum":"MF354ZP/A", "skuName":"iPhone 5s 16GB 金色" },
        { "color":"金", "capacity":"16", "carrier":"电信", "partNum":"MF383CH/A", "skuName":"iPhone 5s 16GB 金色 - 中国电信网络" },
        { "color":"金", "capacity":"16", "carrier":"联通", "partNum":"ME452CH/A", "skuName":"iPhone 5s 16GB 金色 - WCDMA/GSM 网络" },
        { "color":"金", "capacity":"32", "carrier":"香港", "partNum":"MF357ZP/A", "skuName":"iPhone 5s 32GB 金色" },
        { "color":"金", "capacity":"32", "carrier":"电信", "partNum":"MF386CH/A", "skuName":"iPhone 5s 32GB 金色 - 中国电信网络" },
        { "color":"金", "capacity":"32", "carrier":"联通", "partNum":"ME455CH/A", "skuName":"iPhone 5s 32GB 金色 - WCDMA/GSM 网络" },
        { "color":"金", "capacity":"64", "carrier":"香港", "partNum":"MF360ZP/A", "skuName":"iPhone 5s 64GB 金色" },
        { "color":"金", "capacity":"64", "carrier":"电信", "partNum":"MF389CH/A", "skuName":"iPhone 5s 64GB 金色 - 中国电信网络" },
        { "color":"金", "capacity":"64", "carrier":"联通", "partNum":"ME458CH/A", "skuName":"iPhone 5s 64GB 金色 - WCDMA/GSM 网络" },
        { "color":"银", "capacity":"16", "carrier":"香港", "partNum":"MF353ZP/A", "skuName":"iPhone 5s 16GB 銀色" },
        { "color":"银", "capacity":"16", "carrier":"电信", "partNum":"MF382CH/A", "skuName":"iPhone 5s 16GB 银色 - 中国电信网络" },
        { "color":"银", "capacity":"16", "carrier":"联通", "partNum":"ME451CH/A", "skuName":"iPhone 5s 16GB 银色 - WCDMA/GSM 网络" },
        { "color":"银", "capacity":"32", "carrier":"香港", "partNum":"MF356ZP/A", "skuName":"iPhone 5s 32GB 銀色" },
        { "color":"银", "capacity":"32", "carrier":"电信", "partNum":"MF385CH/A", "skuName":"iPhone 5s 32GB 银色 - 中国电信网络" },
        { "color":"银", "capacity":"32", "carrier":"联通", "partNum":"ME454CH/A", "skuName":"iPhone 5s 32GB 银色 - WCDMA/GSM 网络" },
        { "color":"银", "capacity":"64", "carrier":"香港", "partNum":"MF359ZP/A", "skuName":"iPhone 5s 64GB 銀色" },
        { "color":"银", "capacity":"64", "carrier":"电信", "partNum":"MF388CH/A", "skuName":"iPhone 5s 64GB 银色 - 中国电信网络" },
        { "color":"银", "capacity":"64", "carrier":"联通", "partNum":"ME457CH/A", "skuName":"iPhone 5s 64GB 银色 - WCDMA/GSM 网络" },
        { "color":"灰", "capacity":"16", "carrier":"香港", "partNum":"MF352ZP/A", "skuName":"iPhone 5s 16GB 太空灰" },
        { "color":"灰", "capacity":"16", "carrier":"电信", "partNum":"MF381CH/A", "skuName":"iPhone 5s 16GB 深空灰色 - 中国电信网络" },
        { "color":"灰", "capacity":"16", "carrier":"联通", "partNum":"ME450CH/A", "skuName":"iPhone 5s 16GB 深空灰色 - WCDMA/GSM 网络" },
        { "color":"灰", "capacity":"32", "carrier":"香港", "partNum":"MF355ZP/A", "skuName":"iPhone 5s 32GB 太空灰" },
        { "color":"灰", "capacity":"32", "carrier":"电信", "partNum":null, "skuName":null },
        { "color":"灰", "capacity":"32", "carrier":"联通", "partNum":null, "skuName":null },
        { "color":"灰", "capacity":"64", "carrier":"香港", "partNum":"MF358ZP/A", "skuName":"iPhone 5s 64GB 太空灰" },
        { "color":"灰", "capacity":"64", "carrier":"电信", "partNum":null, "skuName":null },
        { "color":"灰", "capacity":"64", "carrier":"联通", "partNum":null, "skuName":null },
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
        console.log( '手机型号错误: ' + color_g + ', ' + capacity_g + ', ' + carrier_g );
        return;
    }
    
    //尝试一百次
    for( k=0; k<15; k++ ){
        for( i=0; i<stores.length; i++ ){
            console.log( skuName_g + ' : ' + stores[i].name );
            sku = van_getsku( stores[i].num );
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
        }
        console.log( "      " + k );
    }
    
    
    if( sku != null )
        console.log( "预约失败: 该型号在该城市的所有直营店都没货." );
    else
        console.log( "预约失败: 服务器无响应." );
    
}

van_get_iphone();



