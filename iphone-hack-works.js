


//TODO
var startime_g              = 3;            //取机时间，下午的时间，例如, 4既是"4:00 下午 - x:00 下午"


/*
var firstName_g            = '荣杰';
var lastName_g             = '黄';
var emailAddress_g         = 'vivian2086@gmail.com'; 
var phoneNumber_g          = '85263531851';
var governmentID_g         = 'TODO';
*/

//TODO
var firstName_g             = '辽';
var lastName_g              = '云';
var emailAddress_g          = '8208354@qq.com'; 
var phoneNumber_g           = '18666911953';
var governmentID_g          = '420288199307081222';






var selectedStore_g         = 'R428';
var storeName_g             = '香港, ifc mall';
var partNumber_g            = 'MF354ZP/A';                                                         
var skuName_g               = 'iPhone 5s 16GB 金色';

var plan_g                  = "UNLOCKED";   //jQuery('.carrier-row').find(' input ').val();     
var timeslotid_g            = null;
var timeSlotStartTime_g     = null;         //jQuery('#hiddenTimeSlot').val().split(',')[2];
var pickUpSlot_g            = null;         //jQuery('.step-seven .selection').html()
var skus_count_g	    = 0;
var selectedSubProduct_g    = 'iPhone 5s';
var pickupMode_g            ='POST_LAUNCH';



function van_getTimeslots() {
    var timeslots = [];
    var startime_tmp = null;
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
                        for( i = startime_g; i < 12 && timeslotid_g == null; i++ ){
                            startime_tmp = i + ':00 下午';
                
                            jQuery.each(timeslots, function(index, val) {
                                console.log( val.formattedTimeForDisplay + ": " + val.timeslotID + ', ' + val.timeslotDate+ ', ' + val.startTime );

                                if( val.formattedTimeForDisplay.split(' - ')[0] == startime_tmp ){
                                    timeSlotStartTime_g = val.startTime;
                                    timeslotid_g = val.timeslotID;
                                    pickUpSlot_g = val.formattedTimeForDisplay;
                                    console.log( "      getTimeSlots success. " + pickUpSlot_g + ": " + timeslotid_g + ', ' + timeSlotStartTime_g + ', ' + val.reservationAvailable );
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


function van_main(){
    
    var i = 0;
    
    van_getTimeslots();
    
    (function doit() {
     setTimeout(function() {
            if( timeslotid_g != null ){
                //TODO
                console.log( "van_onSubmitRequest();" );
                //van_onSubmitRequest();
            }
            if( i++ < 30 && timeslotid_g == null ) {
                console.log( i );
                van_getTimeslots();
                doit();
            }
            }, 200 );
     })();
}

van_main();









