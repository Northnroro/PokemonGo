document.title='[AUTO]'+document.title;
Notification.requestPermission();
var notidict={};
setInterval(function(){
  map.locate();
},10000);
setInterval(function(){
  if($('.nearby').is(':visible')){
    $('nearby').hide();
    $('.nearby').find('img').each(function(){
      var src=$(this).attr('src');
      var num=pokemonPNG.indexOf(src.substring(src.indexOf(',')+1));
      if(!filterdict[num]&&!notidict[num]){
        notidict[num]=true;
        var fulltime=60*15*1000;
        var minute='-';
        var second='--';
        var minDist=9999;
        for(var index in shownMarker){
          if(shownMarker[index].marker.options.icon.options.pokemonid==num){
            var marker=shownMarker[index].marker._latlng;
            var dist=getDistance(map.getCenter().lat,map.getCenter().lng,marker.lat,marker.lng);
            if(dist<minDist){
              minDist=dist;
              fulltime=(parseInt(shownMarker[index].expire)-Date.now())/1000;
              minute=parseInt(fulltime/60);
              second=parseInt(fulltime-minute*60);
            }
          }
        }
        var notification=new Notification('A wild '+pokemonNames[num]+' appears '+parseInt(minDist*1000)+'m. away! ('+minute+':'+(second<10?'0'+second:second)+')',{
          icon:'data:image/png;base64,'+pokemonPNG[num],
          body:'Tap to reset notification.',
        });
        notification.onclick=function(){
          notidict={};
          notification.close();
        };
        setTimeout(function(){
          notification.close();
        },fulltime*1000);
      }
    });
  }else{
  var notification=new Notification('Nothing appears...');
  setTimeout(function(){
    notification.close();
  },1000);
}
},5000);

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