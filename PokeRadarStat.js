
$('.desktop-header').remove();
$('.adroom').remove();
$('#map').css('width','800px');
$('#map').css('height','800px');
var pos = new L.LatLng(13.77,100.55);
setTimeout(function(){
	map.setView(pos,13);
	//marker.setLatLng(pos);
	//circle.setLatLng(pos);
	$('.leaflet-pane .leaflet-marker-pane').hide();
	keepScanning();
},1000);
function keepScanning(){
	var cacheCount = 0;
	var delay = 200;
	var bound = map.getBounds();
	var extra = false;
	for(var i=bound._southWest.lat; i<bound._northEast.lat; i+=0.01) {
		for(var j=bound._southWest.lng+(extra?0.005:0); j<bound._northEast.lng; j+=0.01) {
			setTimeout(throttledLoadCache, cacheCount*delay, new L.LatLng(i,j));
			//setTimeout(getPokemon,cacheCount*delay, i,j);
			setTimeout(cacheOutput, cacheCount*delay);
			setTimeout(setPos, cacheCount++*delay, new L.LatLng(i,j));
		}
		extra = !extra;
	}
	setTimeout(keepScanning,++cacheCount*delay);
}
function setPos(x){
	circle.setLatLng(x);
}
var sentData = [];
var output = "";
function cacheOutput(){
	for(var i in shownMarker){
		if(!sentData[shownMarker[i].id]){
			sentData[shownMarker[i].id] = true;
			if(output != ""){
				output += ",";
			}
			output += "{";
			output += "id:\""+shownMarker[i].id+"\",";
			output += "pokemon_id:\""+shownMarker[i].marker.options.icon.options.pokemonid+"\",";
			output += "latitude:\""+shownMarker[i].marker._latlng.lat+"\",";
			output += "latitude:\""+shownMarker[i].marker._latlng.lng+"\"";
			output += "}";
		}
	}
}
function getOutput(){
	var textToWrite = "{pokemons:[" + output + "]}";
    var textFileAsBlob = new Blob([textToWrite], {type:'text/plain'});
    var fileNameToSaveAs = "pokemon_json.txt";
    var downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;
    downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
    downloadLink.click();
	output = "";
}