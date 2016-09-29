
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
function resetDict(){
	markerDict = [];
	redrawMarker();
}
function allDict(){
	for(var i=1;i<=151;i++){
		markerDict[i] = true;
	}
	redrawMarker();
}
function addDict(x){
	markerDict[x] = true;
	redrawMarker();
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
				pokemonList[pokeid] = {};
			}
			if(!pokemonList[pokeid][hashpos]){
				pokemonList[pokeid][hashpos] = {lat:0, lng:0, count:0};
			}
			var old = pokemonList[pokeid][hashpos];
			pokemonList[pokeid][hashpos] = {lat:parseInt((old.lat*old.count+pokelat)/(old.count+1)*10000)/10000,lng:parseInt((old.lng*old.count+pokelng)/(old.count+1)*10000)/10000,count:old.count+1};
		}
	}
	for(var i in shownMarker){
		shownMarker[i].marker.remove();
	}
	shownMarker = [];
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
			if(count >= max * 0.3 && markerDict[num]){
				var pokeMarker=new L.marker(new L.LatLng(pokemonList[num][hash].lat,pokemonList[num][hash].lng),{icon:createPokeIcon(num,Date.now(),false)});
				map.addLayer(pokeMarker);
				pokeMarker.setLatLng(new L.LatLng(pokemonList[num][hash].lat,pokemonList[num][hash].lng));
				var elementTime=$(pokeMarker._icon).find(".remainingtext");
				elementTime.html(count+"");
				var amount = parseInt(count*12/(max+5));
				elementTime.css('background-color','#E'+(12-amount).toString(16)+'0');
				markerList.push(pokeMarker);
			}
		}
	}
}

function getOutput(){
	var textToWrite = JSON.stringify(pokemonList);
    var textFileAsBlob = new Blob([textToWrite], {type:'text/plain'});
    var fileNameToSaveAs = "pokemon_map.json";
    var downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;
    downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
    downloadLink.click();
	output = "";
}

setInterval(cacheOutput,1000);
setInterval(redrawMarker,30000);
scan();
addDict(1);
addDict(4);
addDict(7);
addDict(10);
addDict(25);