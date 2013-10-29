
//TODO
var timeslotid_g            = '656935';                //val.timeslotID.    oct-29, ifc
var timeSlotStartTime_g     = '1383073200000';         //val.startTime
var pickUpSlot_g            = '7:00 下午 - 8:00 下午';  //val.formattedTimeForDisplay



var firstName_g             = '辽';
var lastName_g              = '云';
var emailAddress_g          = 'vivian2086@gmail.com'; 
var phoneNumber_g           = '85263531851';
var governmentID_g          = '420288199307081222';



// TODO
// var firstName_g            = '荣杰';
// var lastName_g             = '黄';
// var emailAddress_g         = 'vivian2086@gmail.com'; 
// var phoneNumber_g          = '85263531851';
// var governmentID_g         = '450881198703101839';
var selectedStore_g         = 'R428';
var storeName_g             = '香港, ifc mall';
var partNumber_g            = 'MF354ZP/A';                                                         
var skuName_g               = 'iPhone 5s 16GB 金色';
var plan_g                  = "UNLOCKED";   //jQuery('.carrier-row').find(' input ').val();     
var selectedSubProduct_g    = 'iPhone 5s';
var pickupMode_g            = 'POST_LAUNCH';




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

//TODO
van_onSubmitRequest();



