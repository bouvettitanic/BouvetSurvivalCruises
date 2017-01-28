"use strict";
$.ajaxSetup({
   async: false,
   cache: false
});

var tilleggVisible = false;

$(document).ready(function(){
    updateProb();

    // What to do when clicking buy ticket...
    $("#submitTickets").click(function (data){
       console.log("prob changed");
       think();
       setTimeout(unThink, 5000);
       updateProb();
    });

    

    $("#tilleggsPakker").click(function(){
        if (!tilleggVisible){
            getTillegg();
            tilleggVisible = true;
        }
    });

    $("form#tillegg").on("click", "div.tillegg input", function(){
        $(this).attr("disabled", "disabled");
        console.log(this);
        tilleggCheck(this);
    });
});

function think(){
    $("#busy_back").fadeIn();   
    $("#thinking").fadeIn();  
    showTitanim();
}

function unThink(){
    $("#busy_back").fadeOut();
    $("#thinking").fadeOut();  
}

function updateProb(){
    var rq = "http://bouvettitanicapi.azurewebsites.net/api/sant?";
    
    var bookingObj = {}

    rq += "klasse=" + $("#tClass").val();
    rq += "&alder=" + $("#age").val();
    rq += "&kjoenn=" + $("#sex").val();
    rq += "&avreisested=" + $("#origin").val();

    console.log(JSON.stringify(bookingObj));

    $.ajax({
     url:rq,
     dataType: 'json', 
     success:function(json){
        console.log(json);
        setProb(json);
     },
     error:function(){
         console.log("bleh");
     }      
    });

    getTicketPrice();
}

function getTicketPrice(){
    var prices = {1: 999, 2: 499, 3: 99}
    
    var prob = getProb();

    var randomFactor = (Math.floor(Math.random() * (115 - 85)) + 85)/100;    

    var basePrice = $("#tClass").val();

    var price = (prices[basePrice] * (prob/100) ) * randomFactor;
    console.log("Price: " + basePrice + " --> " + prob);

    $("#actualCost").empty().append(price.toFixed(2));
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

                if (prob > 100) {
                    prob = 100;
                }
                $("#probability").empty().append(prob.toFixed(2) + "%");
            }
        }
    });
}

function getProb(){
    return $("#probability").text().substring(0, 5);
}

function setProb(p){
    $("#probability").empty().append((p.probabilityForGruesomeAndAwefulDeath*100).toFixed(2) + "%");
}


function getTillegg(){
    think();
    setTimeout(showTillegg, 2000);
}

function showTitanim(){
    $("#titanim").attr("src", "titanic.gif");
}

function showTillegg(){
    $("form#tillegg").show();
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
    });

    unThink();
}