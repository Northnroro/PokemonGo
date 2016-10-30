var code = "zu0s";
$.ajax({
    url:"https://api.myjson.com/bins/"+code,
    type:"PUT",
    data:'{"quota":' + 100 + '}',
    contentType:"application/json; charset=utf-8",
    dataType:"json"
});

$("#data").val('{"quota": 100 }');