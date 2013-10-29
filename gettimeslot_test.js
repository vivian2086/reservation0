
var pickup_city_g = '香港';


var selectedStore_g         = null;
var storeName_g             = null;
var plan_g                  = "UNLOCKED";   //jQuery('.carrier-row').find(' input ').val();     
var selectedSubProduct_g    = 'iPhone 5s';
var pickupMode_g            = 'POST_LAUNCH';

//
//var startime_g = 3;
//currtime = (new Date).getTime();
//startday = currtime - currtime % 43200000;
//starthour = startday + startime_g * 3600000;
//console.log( startday + ", " + startHour );
//



function van_getTimeslots() {
    var timeslots = [];

    var dataString = 'productName=' + selectedSubProduct_g + '&storeNumber=' + selectedStore_g +'&plan='+ plan_g + '&mode=' + pickupMode_g;

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
                jQuery.each(timeslots, function(index, val) {
                    console.log( val.formattedTimeForDisplay + ": " + val.timeslotID + ', ' + val.timeslotDate+ ', ' + val.startTime );
                    //console.log( val );
                });
            }//if
            console.log( "POST(gettimeslots) success2" );
        },
        error: function () {
            console.log( "POST(getTimeSlots) error" );
        } 		
    });
}







function van_get_timeslot()
{
    
    var i = 0;
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
    


    for( i=0; i<stores.length; i++ ){
        console.log( stores[i].name );
        selectedStore_g         = stores[i].num;
        storeName_g             = stores[i].name;
        van_getTimeslots();
    }
}

van_get_timeslot();








