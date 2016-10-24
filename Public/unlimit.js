setInterval(function(){
	$(".displaypokemon").removeAttr("onclick");
},200);
function initQuota(){
var code = prompt("กรุณาใส่ code");
var quota = 0;
var QUOTA = 0;
var downloading = false;
$.ajax({url:"https://api.myjson.com/bins/"+code, success: function(data) {
	quota = data.quota;
	if(!quota){
		console.log("fail");
		code = prompt("กรุณาใส่ code ใหม่ให้ถูกต้อง");
		if(code == null)
			return;
      	initQuota();
      	return;
	}
	var minus = 5;
	if(quota > minus){
		quota = minus;
	}else{
		minus = quota;
	}
	QUOTA = data.quota-minus;
	$.ajax({
	    url:"https://api.myjson.com/bins/"+code,
	    type:"PUT",
	    data:'{"quota":' + QUOTA + '}',
	    contentType:"application/json; charset=utf-8",
	    dataType:"json"
	});
	$(".scan").find("*").remove();
	$(".scan").append("<center><div id='qqt' style='font-size:30px;'>"+(quota+QUOTA)+"</div></center>");
	map.off("click");
	map.off("dblclick");
	map.on("click", function(event) {
		if(quota > 0){
			quota--;
			$("#qqt").text(quota+QUOTA);
		        var lat = event.latlng.lat;
		        var lng = event.latlng.lng;
		        var cp = new L.LatLng(lat, lng);
		        try {
		            marker.setLatLng(cp);
			    var ccc = new L.circle(cp,200,{color:"red"});
		            map.addLayer(ccc);
		            getPokemon2(cp.lat, cp.lng, ccc);
		        } catch (e) {
		            
		        }
		        throttledLoadCache(cp);
		}
		if(quota <= 0) {
			$("#qqt").text("โหลด");
			if(!downloading){
				downloading = true;
				$.ajax({url:"https://api.myjson.com/bins/"+code, success: function(data) {
					quota = data.quota;
					if(!quota){
						console.log("fail");
						code = prompt("กรุณาใส่ code ใหม่ให้ถูกต้อง");
						if(code == null)
							return;
				      	initQuota();
				      	return;
					}
					var minus = 5;
					if(quota > minus){
						quota = minus;
					}else{
						minus = quota;
					}
					QUOTA = data.quota-minus;
					$.ajax({
					    url:"https://api.myjson.com/bins/"+code,
					    type:"PUT",
					    data:'{"quota":' + QUOTA + '}',
					    contentType:"application/json; charset=utf-8",
					    dataType:"json"
					});
					downloading = false;
					$("#qqt").text(quota+QUOTA);
					if(quota == 0){
						code = prompt("แต้มหมดแล้ว กรุณาร่วมกิจกรรมกับทางเพจเพื่อรับแต้มเพิ่ม\nFB: Pokemon Go Map Thailand\nยังมีโค้ดอื่นหรือ? ใส่ได้เลย");
						initQuota();
					}
				}, statusCode: {
				    404: function() {
				      console.log("fail");
				      code = prompt("กรุณาใส่ code ใหม่ให้ถูกต้อง");
				      initQuota();
				    }}
				});
			}
		}
	});
}, statusCode: {
    404: function() {
      console.log("fail");
      code = prompt("กรุณาใส่ code ใหม่ให้ถูกต้อง");
      if(code == null)
		return;
      initQuota();
    }
}});
}

initQuota();

function getPokemon2(lat, lng, ccc) {
	var blink = setInterval(function(){
		ccc.setStyle({color:"#300"});
		setTimeout(function(){
			ccc.setStyle({color:"#700"});
		},250);
		setTimeout(function(){
			ccc.setStyle({color:"#A00"});
		},500);
		setTimeout(function(){
			ccc.setStyle({color:"#F00"});
		},750);
	},1000);
    $.getJSON("https://api.fastpokemap.se/?lat=" + lat + "&lng=" + lng, function (data) {
		if (data.error && data.error == "overload") {
			return setTimeout(function() { getPokemon(lat,lng); }, 500);
		}
            console.log("Successful scan");
            status = 'success';       
            $('.scan').removeClass('active').addClass(status); // Add statuscolor to scanbutton
            setTimeout(function() {
                $('.scan').removeClass(status);
            }, 1500);
            $(".nearby").html('<div style="width:100px;"><h3>0 MONSTER FOUND</h3></div>');
            if (data && data.result && data.result.length >= 1) {
                var i;
		nFound = 0;
		bufferRadar = "";
                var foundNearbyPokemon = false;
                for (i in data.result) {
                    var spawn = data.result[i];
                    if (spawn.spawn_point_id != undefined) {
                        if (spawn.expiration_timestamp_ms <= 0)
                            spawn.expiration_timestamp_ms = Date.now() + 930000;
                        addPokemonToMap(spawn);
                    } else if (spawn.lure_info != undefined) {
                        spawn.encounter_id = spawn.lure_info.encounter_id;
                        spawn.pokemon_id = spawn.lure_info.active_pokemon_id;
                        spawn.expiration_timestamp_ms = spawn.lure_info.lure_expires_timestamp_ms;
                        addPokemonToMap(spawn);
                    }
					nFound++;
					foundNearbyPokemon = true;
					bufferRadar += '<div class="pokemon"><img src="data:image/png;base64,' + pokemonPNG[PokemonIdList[spawn.pokemon_id]] + '" /></div>';
                }
		if (nFound >= 1) {
			if (oldView)
			 $(".nearby").html(bufferRadar);
			else
			 $(".nearby").html('<div style="width:115px;"><h3>' + nFound  +' MONSTER(S) FOUND</h3></div>');
		}
	                
            }        
	clearInterval(blink);
		var expand = setInterval(function(){
            		ccc.setStyle({color:"green"});
			ccc.setRadius(ccc.getRadius()+2);
		},50);
		setTimeout(function(){
			map.removeLayer(ccc);
		},2000);
                $(".nearby").show();
        

        }).fail( function( xhr, status ) {
	map.removeLayer(ccc);
	clearInterval(blink);
        console.log("Scan failed");        
        $(".scan").prop("disabled", false);
        curstatus = 'failed';
        isScanning = false;
        var currfailure = Date.now();
        $('.scan').data("failid", currfailure);
        $('.scan').removeClass('active').addClass(curstatus); // Add statuscolor to scanbutton
        setTimeout(function() {
            if($('.scan').data("failid") == currfailure) { //make sure the status color of the last failure will always last 1.5s
                $('.scan').removeClass(curstatus);
                currfailure = null;
            }
        }, 1500); // Hide status color after 1,5 seconds
    });
}