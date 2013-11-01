
var pickup_city_g = '香港';
var selectedSubProduct_g    = 'iPhone 5s';




function van_check_open( sku, partNum ) {
    
    var partNum_enabled = false;
    
    jQuery.each(sku, function(product,productData) {
        jQuery.each(productData, function(color,colorData) {	
            console.log( color );
            
            jQuery.each(colorData, function(sTitle1,sTitle1Data) { 
                jQuery.each(sTitle1Data, function(carrier,carrierData) { 
                    if( carrier.toLowerCase() == 'unlocked' ){
                        jQuery.each(carrierData, function(capacity,capacityData) {
                            jQuery.each(capacityData, function(index,skuData) {
				if (index === 0) {
                                    if( skuData.enabled ){
                                            partNum_enabled = true;
                                            return false;
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




function van_get_iphone()
{
    
    var tmp_time;
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
    
    //尝试一百次
    for( k=0; k<5; k++ ){
	for( i=0; i<stores.length; i++ ){
            console.log( "(1) " + Date() +  ", " +  stores[i].name );
            sku = van_getsku( stores[i].num );
            console.log( "(2) " + Date() );
	    console.log( "\n\n" );
	    if( sku != null ){
		if( van_check_open( sku, partNumber_g ) == true ){                
                    console.log( "open" );
		    return;
		}
            }
	}
    }
    
    console.log( "not open yet\n\n\n\n" );
}

van_get_iphone();



