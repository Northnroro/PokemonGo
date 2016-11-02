$('.desktop-header').remove();
$('.adroom').remove();
$("#map").css("height","100vh");
map.invalidateSize();
var offset = 0;
var pauseVar = false;
function scan(){
	var cacheCount = 0;
	var bound = map.getBounds();
	var extra = false;
	var delay = 100;
	for(var i=bound._southWest.lat+offset; i<bound._northEast.lat; i+=0.01) {
		for(var j=bound._southWest.lng+(extra?0.005:0)+offset; j<bound._northEast.lng; j+=0.01) {
			setTimeout(throttledLoadCache, cacheCount*delay, new L.LatLng(i,j));
			if(Math.random() > 0.5){setTimeout(getPokemon, cacheCount*delay, i, j);}
			setTimeout(setPos, cacheCount++*delay, new L.LatLng(i,j));
		}
		extra = !extra;
	}
	offset = (offset+0.003)%0.01;
	if(!pauseVar){
		setTimeout(scan,cacheCount*delay);
	}else{
		pauseVar = false;
	}
}
function setPos(x){
 circle.setLatLng(x);
}

function pause(){
	pauseVar = true;
}

var sentData = [];
var pokemonList = [];
var markerList = [];
var markerDict = [];
var currentPokemon = 0;
function resetDict(){
	markerDict = [];
	currentPokemon = 0;
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
function nextDict(){
	if(currentPokemon == 0 || (markerDict[currentPokemon] && pokemonNames[currentPokemon])){
		if(markerDict[currentPokemon]){
			markerDict[currentPokemon] = false;
		}
		currentPokemon++;
		markerDict[currentPokemon] = true;
		redrawMarker();
	}
}
function cacheOutput(){
	var bound = map.getBounds();
	var precision = 400; // 100
	for(var i in shownMarker){
		if(!sentData[shownMarker[i].id]){
			sentData[shownMarker[i].id] = true;
			var pokeid = shownMarker[i].marker.options.icon.options.pokemonid;
			var pokelat = shownMarker[i].marker._latlng.lat;
			var pokelng = shownMarker[i].marker._latlng.lng;
			if(parseInt(pokelat*precision) < parseInt(bound._southWest.lat*precision) || parseInt(pokelat*precision) >= parseInt(bound._northEast.lat*precision) || 
				parseInt(pokelng*precision) < parseInt(bound._southWest.lng*precision) || parseInt(pokelng*precision) >= parseInt(bound._northEast.lng*precision)){
				continue;
			}
			var hashpos = parseInt(pokelat*precision)+","+parseInt(pokelng*precision); /* HASH FUNCTION hash function */
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
	if(!pokemonList[0]){
		pokemonList[0] = {};
	}
	for(var i=bound._southWest.lat; i<bound._northEast.lat; i+=1.0/precision) {
		for(var j=bound._southWest.lng; j<bound._northEast.lng; j+=1.0/precision) {
			var hashpos = parseInt(i*precision)+","+parseInt(j*precision); /* HASH FUNCTION hash function */
			if(!pokemonList[0][hashpos]){
				pokemonList[0][hashpos] = {time:0};
			}
			pokemonList[0][hashpos].time = pokemonList[0][hashpos].time+10;
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
			if(!pokemonList[0][hash]){
				pokemonList[0][hash] = {time:0};
			}
			var count = pokemonList[num][hash].count/(pokemonList[0][hash].time+1);
			if(count > max){
				max = count;
			}
		}
		for(var hash in pokemonList[num]){
			if(!pokemonList[0][hash]){
				pokemonList[0][hash] = {time:0};
			}
			var count = pokemonList[num][hash].count;
			if(count/(pokemonList[0][hash].time+1) >= max * 0.3 && markerDict[num]){
				var pokeMarker=new L.marker(new L.LatLng(pokemonList[num][hash].lat,pokemonList[num][hash].lng),{icon:createPokeIcon(num,Date.now(),false)});
				map.addLayer(pokeMarker);
				pokeMarker.setLatLng(new L.LatLng(pokemonList[num][hash].lat,pokemonList[num][hash].lng));
				var elementTime=$(pokeMarker._icon).find(".remainingtext");
				elementTime.html(count+"");
				var amount = parseInt(count/(pokemonList[0][hash].time+1)*12/(max+0.003));
				if(amount <= 6){
					amount = parseInt(amount*4/5);
				}
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
// jQuery.getJSON("https://rawgit.com/Northnroro/PokemonGo/master/pokemon_map.json", function(data){
// 	pokemonList = data;
// 	setInterval(cacheOutput,10000);
// 	setInterval(redrawMarker,30000);
// 	scan();
// 	resetDict();
// 	addDict(1);
// 	addDict(4);
// 	addDict(7);
// 	addDict(10);
// 	addDict(25);
// });

// jQuery.getJSON("https://rawgit.com/Northnroro/PokemonGo/master/pokemon_map.json", function(data){
	pokemonList = [];
	setInterval(cacheOutput,10000);
	setInterval(redrawMarker,30000);
	scan();
	resetDict();
	addDict(1);
	addDict(4);
	addDict(7);
	addDict(10);
	addDict(25);
// });