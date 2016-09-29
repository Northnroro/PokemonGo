
var offset = 0;
function scan(){
	var cacheCount = 0;
	var bound = map.getBounds();
	var extra = false;
	for(var i=bound._southWest.lat+offset; i<bound._northEast.lat; i+=0.01) {
		for(var j=bound._southWest.lng+(extra?0.005:0)+offset; j<bound._northEast.lng; j+=0.01) {
			setTimeout(throttledLoadCache, cacheCount*200, new L.LatLng(i,j));
			if(Math.random() > 0.8){setTimeout(getPokemon, cacheCount*200, i, j);}
			setTimeout(setPos, cacheCount++*200, new L.LatLng(i,j));
		}
		extra = !extra;
	}
	offset = (offset+0.003)%0.01;
	setTimeout(scan,cacheCount*200);
}
function setPos(x){
 circle.setLatLng(x);
}

var sentData = [];
var pokemonList = [];
var markerList = [];
var markerDict = [];
for(var i=1;i<=151;i++){
	markerDict[i] = true;
}
function resetDict(){
	markerDict = [];
}
function addDict(x){
	markerDict[x] = true;
}
function cacheOutput(){
	for(var i in shownMarker){
		if(!sentData[shownMarker[i].id]){
			sentData[shownMarker[i].id] = true;
			var pokeid = shownMarker[i].marker.options.icon.options.pokemonid;
			var pokelat = shownMarker[i].marker._latlng.lat;
			var pokelng = shownMarker[i].marker._latlng.lng;
			var hashpos = parseInt(pokelat*100)+","+parseInt(pokelng*100);
			if(!pokemonList[pokeid]){
				pokemonList[pokeid] = [];
			}
			if(!pokemonList[pokeid][hashpos]){
				pokemonList[pokeid][hashpos] = {lat:0, lng:0, count:0};
			}
			var old = pokemonList[pokeid][hashpos];
			pokemonList[pokeid][hashpos] = {lat:(old.lat*old.count+pokelat)/(old.count+1),lng:(old.lng*old.count+pokelng)/(old.count+1),count:old.count+1};
		}
	}
	redrawMarker();
}

function redrawMarker(){
	for(var index in markerList){
		markerList[index].remove();
	}
	markerList = [];
	for(var num in pokemonList){
		var max = 0;
		for(var hash in pokemonList[num]){
			var count = pokemonList[num][hash].count;
			if(count > max){
				max = count;
			}
		}
		for(var hash in pokemonList[num]){
			var count = pokemonList[num][hash].count;
			if(count > max * 0.3 && markerDict[num]){
				var pokeMarker=new L.marker(new L.LatLng(pokemonList[num][hash].lat,pokemonList[num][hash].lng),{icon:createPokeIcon(num,Date.now(),false)});
				map.addLayer(pokeMarker);
				pokeMarker.setLatLng(new L.LatLng(pokemonList[num][hash].lat,pokemonList[num][hash].lng));
				var elementTime=$(pokeMarker._icon).find(".remainingtext");
				elementTime.html(count+"");
				var amount = parseInt(count*9/(max+5));
				elementTime.css('background-color','#D'+(9-amount)+'0');
				markerList.push(pokeMarker);
			}
		}
	}
}

setInterval(cacheOutput,5000);
alert("Please type javascript:scan(); in URL box to start scan.\nresetDict() and addDict(num) to set visible.");