"use strict";
$.ajaxSetup({
   async: false,
   cache: false
});

var voksenFormTemplate = '<div><div>Adult __ID__</div><span>Age:</span><input id="age_ad___ID__" /><span>Sex</span><select id="sex_ad___ID__"><option value="Male" selected="selected">Male</option><option value="Female">Female</option></select><span class="pSurvive_ad___ID__"></span></div>';
var barnFormTemplate = '<div><div>Child __ID__</div><span>Age:</span><input id="age_child___ID__" /><span>Sex</span><select id="sex_child___ID__"><option value="Male" selected="selected">Male</option><option value="Female">Female</option></select><span class="pSurvive_child___ID__"></span></div>';
$(document).ready(function(){

    // What to do when clicking buy ticket...
    $("#submitTickets").click(function (data){
        var bookingObj = {}

        bookingObj.from = $("#avreisested").val();
        bookingObj.tclass = $("#tClass").val();

        var adults = []
        var kids=[];

        var adCnt = $("#voksneInputs > div").length;
        var kidsCnt = $("#barnInputs > div").length;

        console.log("Ant ad: " + adCnt);
        console.log("Ant kids: " + kidsCnt);

        for(var i=0; i<adCnt; i++){
            var adult = {}
            
            adult.id = i;
            adult.age = $("#age_ad_" + i).val();
            adult.sex = $("#sex_ad_" + i).val();

            adults.push(adult);
        }

        for(var i=0; i<kidsCnt; i++){
            var kid = {}
            
            kid.id = i;
            kid.age = $("#age_child_" + i).val();
            kid.sex = $("#sex_child_" + i).val();

            kids.push(kid);
        }

        bookingObj.adults = adults;
        bookingObj.kids = kids;

        console.log(JSON.stringify(bookingObj));
    });

    $("#inp_voksne").change(function(){
        var antVoksne = $("#inp_voksne").val();
       
        console.log("voksne chg");
        $("#voksneInputs").empty();

        for (var i=0; i<antVoksne; i++){ 
            console.log("voksne +1");
            $("#voksneInputs").append(voksenFormTemplate.replace(/__ID__/g, i));
        }
    });
    
    $("#inp_barn").change(function(){
        var antBarn = $("#inp_barn").val();

        console.log("barn chg");
        $("#barnInputs").empty();
        for (var i=0; i<antBarn; i++){
            console.log("barn +1");
            $("#barnInputs").append(barnFormTemplate.replace(/__ID__/g, i));
        }
    });
});
