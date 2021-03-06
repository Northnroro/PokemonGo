document.title='[AUTO]'+document.title;
Notification.requestPermission();
var notidict={};
var center = map.getCenter();
setInterval(function(){
  map.locate();
  setTimeout(function(){
    center = map.getCenter();
    var delay = 0;
    for(var i=-2;i<=2;i++){
      for(var j=-2;j<=2;j++){
        setTimeout(getPokemon,delay*500,center.lat+0.002*i,center.lng+0.002*j);
        setTimeout(throttledLoadCache,delay*500,new L.LatLng(center.lat+0.002*i,center.lng+0.002*j));
        setTimeout(setPos,delay++*500,new L.LatLng(center.lat+0.002*i,center.lng+0.002*j));
      }
    }
  },1000);
},15000);

function setPos(x){
 circle.setLatLng(x);
}

var distDict = [];
var popup = false;

setInterval(function(){
  for(var index in shownMarker){
    var num = shownMarker[index].marker.options.icon.options.pokemonid;
    var markerId = shownMarker[index].id;
    if(!filterdict[num] && !notidict[markerId]){
      var marker=shownMarker[index].marker._latlng;
      var dist=getDistance(center.lat,center.lng,marker.lat,marker.lng)*1000;
      var pkmnimg = new Image;
      pkmnimg.src = 'data:image/png;base64,'+pokemonPNG[num];
      pkmnimg = imageToDataUri(pkmnimg);
      var expDate = parseInt(shownMarker[index].expire);
      var first = true;
      var threshold = 700;
      if(distDict[num]){
        threshold = distDict[num];
      }else if(distDict[pokemonNames[num]]){
        threshold = distDict[pokemonNames[num]];
      }
      if(dist < threshold || (dist < threshold+50 && (expDate-Date.now())/1000 > 13*60)){
        notidict[markerId]=true;
        //var interval = setInterval(function(){
          var fulltime=(expDate-Date.now())/1000;
          var minute=parseInt(fulltime/60);
          var second=parseInt(fulltime-minute*60);
          if(fulltime >= 0){
            if(popup){
              alert('A wild '+pokemonNames[num]+' appears!\n' + 'It is ' + parseInt(dist) + 'm. away! ('+minute+':'+(second<10?'0'+second:second) + ' left)');
            }
            var notification=new Notification('A wild '+pokemonNames[num]+' appears!',{
              icon:pkmnimg,
              body:'It is ' + parseInt(dist) + 'm. away! ('+minute+':'+(second<10?'0'+second:second) + ' left)',
              tag:markerId,
              renotify:true,
              silent:!first,
            });
            notification.onclick=function(){
              notification.close();
            };
          }
          first = false;
        //},10000);
        //setTimeout(clearInterval,expDate-Date.now(),interval);
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

  function setDistance(name, distance){
    distDict[name] = distance;
  }