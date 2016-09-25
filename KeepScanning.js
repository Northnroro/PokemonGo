function keepScanning(){
	var cacheCount = 0;
	var bound = map.getBounds();
	var extra = false;
	for(var i=bound._southWest.lat; i<bound._northEast.lat; i+=0.003) {
		for(var j=bound._southWest.lng+(extra?0.0015:0); j<bound._northEast.lng; j+=0.003) {
			setTimeout(throttledLoadCache, cacheCount*700, new L.LatLng(i,j));
			setTimeout(getPokemon,cacheCount*700, i,j);
			setTimeout(setPos, cacheCount++*700, new L.LatLng(i,j));
		}
		extra = !extra;
	}
	setTimeout(keepScanning,++cacheCount*700);
}
function setPos(x){
 circle.setLatLng(x);
}
alert("Please Type \"javascript:keepScanning\" in URL box to start.")