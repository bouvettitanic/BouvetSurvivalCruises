"use strict";
$.ajaxSetup({
   async: false,
   cache: false
});

$(document).ready(function(){

    // What to do when clicking buy ticket...
    $("#submitTickets").click(function (data){
        var bookingObj = {}

        bookingObj.tclass = $("#tClass").val();
        bookingObj.age = $("#age").val();
        bookingObj.sex = $("#sex").val();
        bookingObj.origin = $("#origin").val();

        console.log(JSON.stringify(bookingObj));
    });
});
