"use strict";
$.ajaxSetup({
   async: false,
   cache: false
});

var tilleggVisible = false;

$(document).ready(function(){

    // What to do when clicking buy ticket...
    $("#submitTickets").click(function (data){
       console.log("prob changed");
       updateProb();
    });

    

    $("#tilleggsPakker").click(function(){
        if (!tilleggVisible){
            getTillegg();
        }
    });

    $("form#tillegg").on("click", "div.tillegg input", function(){
        tilleggCheck(this);
    });
});

function updateProb(){
    var rq = "http://bouvettitanicapi.azurewebsites.net/api/Sannsynlighets";
    
    var bookingObj = {}

    rq += "?klasse=" + $("#tClass").val();
    rq += "&alder=" + $("#age").val();
    rq += "&kjoenn=" + $("#sex").val();
    rq += "&avreisested=" + $("#origin").val();

    console.log(JSON.stringify(bookingObj));

    $.ajax({
     url:rq,
     dataType: 'jsonp', 
     success:function(json){
        console.log(data);
        setProb(data);
     },
     error:function(){
         console.log("bleh");
     }      
    });
}

function tilleggCheck(t){
    var tId = $(t).parent().attr('id');

    console.log("TID = " + tId);
    $.getJSON("tillegg.json", function(data){
        for(var i=0; i<data.length; i++){
            if (data[i].id == tId){
                var actualCost = parseInt($("#actualCost").text());
                console.log("Cost: " + actualCost);

                actualCost = actualCost + parseInt(data[i].cost);
                $("#actualCost").empty().append(actualCost);

                var prob = $("#probability").text();
                prob = prob.substring(0, prob.length-1);

                prob = ((data[i].boost/100)+1) * (prob);

                console.log(data[i].boost + " --- " + prob );

                $("#probability").empty().append(prob.toFixed(2) + "%");
            }
        }
    });
}

function getProb(){
    return $("#probability").val().substring(0, $("#probability").length-1);
}

function setProb(p){
    $("#probability").empty().append(p + "%");
}


function getTillegg(){
    $.getJSON("tillegg.json", function(data){
        for (var i=0; i<data.length; i++){
            
            var t = '<div id="' + data[i].id + '" class="tillegg row"><span class="box boxgrey">' + data[i].desc + '</span>';
            t += '<input type="checkbox" class="tcheck boxgrey" />';
            t += '<span class="box">+' + data[i].boost + '%</span>';
            t += '<span class="box">' + data[i].cost + '</span>';
            t += '</div>';

            $("form#tillegg").append(t);
        } 

        $("form#bestill").hide();
        $("form#tillegg").show();
        
    });


}