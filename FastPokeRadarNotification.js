document.title='[AUTO]'+document.title;
Notification.requestPermission();
var notidict={};
setInterval(function(){
  map.locate();
  var center = map.getCenter();
  var delay = 0;
  for(var i=-2;i<=2;i++){
    for(var j=-2;j<=2;j++){
      setTimeout(getPokemon,delay++*500,center.lat+0.002*i,center.lng+0.002*j);
    }
  }
},15000);

setInterval(function(){
  for(var index in shownMarker){
    var num = shownMarker[index].marker.options.icon.options.pokemonid;
    var markerId = shownMarker[index].id;
    if(!filterdict[num] && !notidict[markerId]){
      var marker=shownMarker[index].marker._latlng;
      notidict[markerId]=true;
      var dist=getDistance(map.getCenter().lat,map.getCenter().lng,marker.lat,marker.lng)*1000;
      var pkmnimg = new Image;
      pkmnimg.src = 'data:image/png;base64,'+pokemonPNG[num];
      pkmnimg = imageToDataUri(pkmnimg);
      var expDate = parseInt(shownMarker[index].expire);
      var first = true;
      if(dist < 750){
        var interval = setInterval(function(){
          var fulltime=(expDate-Date.now())/1000;
          var minute=parseInt(fulltime/60);
          var second=parseInt(fulltime-minute*60);
          var notification=new Notification('A wild '+pokemonNames[num]+' appears!',{
            icon:pkmnimg,
          body:'It is ' + parseInt(dist)*1000 + 'm. away! ('+minute+':'+(second<10?'0'+second:second) + ' left)',
          tag:markerId,
          renotify:true,
          silent:!first,
        });
          notification.onclick=function(){
            notification.close();
          };
          first = false;
        },5000);
        setTimeout(function(){clearInterval(interval);},expDate-Date.now());
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

function imageToDataUri(img) {

    // create an off-screen canvas
    var canvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d');

    // set its dimension to target size
    canvas.width = 128;
    canvas.height = 128;

    // draw source image into the off-screen canvas:
    ctx.drawImage(img, 0, 0, 128, Math.min(img.width,img.height)*128/img.width);

    // encode image to data-uri with base64 version of compressed image
    return canvas.toDataURL();
  }