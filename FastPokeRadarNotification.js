document.title='[AUTO]'+document.title;
Notification.requestPermission();
var notidict={};
setInterval(function(){
  map.locate();
},5000);
setInterval(function(){
  for(var index in shownMarker){
    var num = shownMarker[index].marker.options.icon.options.pokemonid;
    var markerId = shownMarker[index].id;
    if(!filterdict[num] && !notidict[markerId]){
      var marker=shownMarker[index].marker._latlng;
      notidict[markerId]=true;
      var fulltime=(parseInt(shownMarker[index].expire)-Date.now())/1000;
      var minute=parseInt(fulltime/60);
      var second=parseInt(fulltime-minute*60);
      var dist=getDistance(map.getCenter().lat,map.getCenter().lng,marker.lat,marker.lng)*1000;
      if(dist < 1000){
        var notification=new Notification('A wild '+pokemonNames[num]+' appears!',{
          icon:'data:image/png;base64,'+pokemonPNG[num],
          body:'It is ' + parseInt(minDist) + 'm. away! ('+minute+':'+(second<10?'0'+second:second) + ' left)',
        });
        notification.onclick=function(){
          notification.close();
        };
      }
    }
  }
},3000);

function getDistance(lat1,lon1,lat2,lon2) {
  var R=6371;
  var dLat=deg2rad(lat2-lat1);
  var dLon=deg2rad(lon2-lon1);
  var a=Math.sin(dLat/2)*Math.sin(dLat/2)+Math.cos(deg2rad(lat1))*Math.cos(deg2rad(lat2))*Math.sin(dLon/2)*Math.sin(dLon/2); 
  var c=2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a)); 
  var d=R*c;
  return d;
}

function deg2rad(deg) {
  return deg*(Math.PI/180);
}