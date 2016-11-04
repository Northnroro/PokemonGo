(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.S2=f()}})(function(){var define,module,exports;return function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}({1:[function(require,module,exports){(function(global,factory){if(typeof define==="function"&&define["amd"])define([],factory);else if(typeof require==="function"&&typeof module==="object"&&module&&module["exports"])module["exports"]=factory();else(global["dcodeIO"]=global["dcodeIO"]||{})["Long"]=factory()})(this,function(){"use strict";function Long(low,high,unsigned){this.low=low|0;this.high=high|0;this.unsigned=!!unsigned}Long.prototype.__isLong__;Object.defineProperty(Long.prototype,"__isLong__",{value:true,enumerable:false,configurable:false});function isLong(obj){return(obj&&obj["__isLong__"])===true}Long.isLong=isLong;var INT_CACHE={};var UINT_CACHE={};function fromInt(value,unsigned){var obj,cachedObj,cache;if(unsigned){value>>>=0;if(cache=0<=value&&value<256){cachedObj=UINT_CACHE[value];if(cachedObj)return cachedObj}obj=fromBits(value,(value|0)<0?-1:0,true);if(cache)UINT_CACHE[value]=obj;return obj}else{value|=0;if(cache=-128<=value&&value<128){cachedObj=INT_CACHE[value];if(cachedObj)return cachedObj}obj=fromBits(value,value<0?-1:0,false);if(cache)INT_CACHE[value]=obj;return obj}}Long.fromInt=fromInt;function fromNumber(value,unsigned){if(isNaN(value)||!isFinite(value))return unsigned?UZERO:ZERO;if(unsigned){if(value<0)return UZERO;if(value>=TWO_PWR_64_DBL)return MAX_UNSIGNED_VALUE}else{if(value<=-TWO_PWR_63_DBL)return MIN_VALUE;if(value+1>=TWO_PWR_63_DBL)return MAX_VALUE}if(value<0)return fromNumber(-value,unsigned).neg();return fromBits(value%TWO_PWR_32_DBL|0,value/TWO_PWR_32_DBL|0,unsigned)}Long.fromNumber=fromNumber;function fromBits(lowBits,highBits,unsigned){return new Long(lowBits,highBits,unsigned)}Long.fromBits=fromBits;var pow_dbl=Math.pow;function fromString(str,unsigned,radix){if(str.length===0)throw Error("empty string");if(str==="NaN"||str==="Infinity"||str==="+Infinity"||str==="-Infinity")return ZERO;if(typeof unsigned==="number"){radix=unsigned,unsigned=false}else{unsigned=!!unsigned}radix=radix||10;if(radix<2||36<radix)throw RangeError("radix");var p;if((p=str.indexOf("-"))>0)throw Error("interior hyphen");else if(p===0){return fromString(str.substring(1),unsigned,radix).neg()}var radixToPower=fromNumber(pow_dbl(radix,8));var result=ZERO;for(var i=0;i<str.length;i+=8){var size=Math.min(8,str.length-i),value=parseInt(str.substring(i,i+size),radix);if(size<8){var power=fromNumber(pow_dbl(radix,size));result=result.mul(power).add(fromNumber(value))}else{result=result.mul(radixToPower);result=result.add(fromNumber(value))}}result.unsigned=unsigned;return result}Long.fromString=fromString;function fromValue(val){if(val instanceof Long)return val;if(typeof val==="number")return fromNumber(val);if(typeof val==="string")return fromString(val);return fromBits(val.low,val.high,val.unsigned)}Long.fromValue=fromValue;var TWO_PWR_16_DBL=1<<16;var TWO_PWR_24_DBL=1<<24;var TWO_PWR_32_DBL=TWO_PWR_16_DBL*TWO_PWR_16_DBL;var TWO_PWR_64_DBL=TWO_PWR_32_DBL*TWO_PWR_32_DBL;var TWO_PWR_63_DBL=TWO_PWR_64_DBL/2;var TWO_PWR_24=fromInt(TWO_PWR_24_DBL);var ZERO=fromInt(0);Long.ZERO=ZERO;var UZERO=fromInt(0,true);Long.UZERO=UZERO;var ONE=fromInt(1);Long.ONE=ONE;var UONE=fromInt(1,true);Long.UONE=UONE;var NEG_ONE=fromInt(-1);Long.NEG_ONE=NEG_ONE;var MAX_VALUE=fromBits(4294967295|0,2147483647|0,false);Long.MAX_VALUE=MAX_VALUE;var MAX_UNSIGNED_VALUE=fromBits(4294967295|0,4294967295|0,true);Long.MAX_UNSIGNED_VALUE=MAX_UNSIGNED_VALUE;var MIN_VALUE=fromBits(0,2147483648|0,false);Long.MIN_VALUE=MIN_VALUE;var LongPrototype=Long.prototype;LongPrototype.toInt=function toInt(){return this.unsigned?this.low>>>0:this.low};LongPrototype.toNumber=function toNumber(){if(this.unsigned)return(this.high>>>0)*TWO_PWR_32_DBL+(this.low>>>0);return this.high*TWO_PWR_32_DBL+(this.low>>>0)};LongPrototype.toString=function toString(radix){radix=radix||10;if(radix<2||36<radix)throw RangeError("radix");if(this.isZero())return"0";if(this.isNegative()){if(this.eq(MIN_VALUE)){var radixLong=fromNumber(radix),div=this.div(radixLong),rem1=div.mul(radixLong).sub(this);return div.toString(radix)+rem1.toInt().toString(radix)}else return"-"+this.neg().toString(radix)}var radixToPower=fromNumber(pow_dbl(radix,6),this.unsigned),rem=this;var result="";while(true){var remDiv=rem.div(radixToPower),intval=rem.sub(remDiv.mul(radixToPower)).toInt()>>>0,digits=intval.toString(radix);rem=remDiv;if(rem.isZero())return digits+result;else{while(digits.length<6)digits="0"+digits;result=""+digits+result}}};LongPrototype.getHighBits=function getHighBits(){return this.high};LongPrototype.getHighBitsUnsigned=function getHighBitsUnsigned(){return this.high>>>0};LongPrototype.getLowBits=function getLowBits(){return this.low};LongPrototype.getLowBitsUnsigned=function getLowBitsUnsigned(){return this.low>>>0};LongPrototype.getNumBitsAbs=function getNumBitsAbs(){if(this.isNegative())return this.eq(MIN_VALUE)?64:this.neg().getNumBitsAbs();var val=this.high!=0?this.high:this.low;for(var bit=31;bit>0;bit--)if((val&1<<bit)!=0)break;return this.high!=0?bit+33:bit+1};LongPrototype.isZero=function isZero(){return this.high===0&&this.low===0};LongPrototype.isNegative=function isNegative(){return!this.unsigned&&this.high<0};LongPrototype.isPositive=function isPositive(){return this.unsigned||this.high>=0};LongPrototype.isOdd=function isOdd(){return(this.low&1)===1};LongPrototype.isEven=function isEven(){return(this.low&1)===0};LongPrototype.equals=function equals(other){if(!isLong(other))other=fromValue(other);if(this.unsigned!==other.unsigned&&this.high>>>31===1&&other.high>>>31===1)return false;return this.high===other.high&&this.low===other.low};LongPrototype.eq=LongPrototype.equals;LongPrototype.notEquals=function notEquals(other){return!this.eq(other)};LongPrototype.neq=LongPrototype.notEquals;LongPrototype.lessThan=function lessThan(other){return this.comp(other)<0};LongPrototype.lt=LongPrototype.lessThan;LongPrototype.lessThanOrEqual=function lessThanOrEqual(other){return this.comp(other)<=0};LongPrototype.lte=LongPrototype.lessThanOrEqual;LongPrototype.greaterThan=function greaterThan(other){return this.comp(other)>0};LongPrototype.gt=LongPrototype.greaterThan;LongPrototype.greaterThanOrEqual=function greaterThanOrEqual(other){return this.comp(other)>=0};LongPrototype.gte=LongPrototype.greaterThanOrEqual;LongPrototype.compare=function compare(other){if(!isLong(other))other=fromValue(other);if(this.eq(other))return 0;var thisNeg=this.isNegative(),otherNeg=other.isNegative();if(thisNeg&&!otherNeg)return-1;if(!thisNeg&&otherNeg)return 1;if(!this.unsigned)return this.sub(other).isNegative()?-1:1;return other.high>>>0>this.high>>>0||other.high===this.high&&other.low>>>0>this.low>>>0?-1:1};LongPrototype.comp=LongPrototype.compare;LongPrototype.negate=function negate(){if(!this.unsigned&&this.eq(MIN_VALUE))return MIN_VALUE;return this.not().add(ONE)};LongPrototype.neg=LongPrototype.negate;LongPrototype.add=function add(addend){if(!isLong(addend))addend=fromValue(addend);var a48=this.high>>>16;var a32=this.high&65535;var a16=this.low>>>16;var a00=this.low&65535;var b48=addend.high>>>16;var b32=addend.high&65535;var b16=addend.low>>>16;var b00=addend.low&65535;var c48=0,c32=0,c16=0,c00=0;c00+=a00+b00;c16+=c00>>>16;c00&=65535;c16+=a16+b16;c32+=c16>>>16;c16&=65535;c32+=a32+b32;c48+=c32>>>16;c32&=65535;c48+=a48+b48;c48&=65535;return fromBits(c16<<16|c00,c48<<16|c32,this.unsigned)};LongPrototype.subtract=function subtract(subtrahend){if(!isLong(subtrahend))subtrahend=fromValue(subtrahend);return this.add(subtrahend.neg())};LongPrototype.sub=LongPrototype.subtract;LongPrototype.multiply=function multiply(multiplier){if(this.isZero())return ZERO;if(!isLong(multiplier))multiplier=fromValue(multiplier);if(multiplier.isZero())return ZERO;if(this.eq(MIN_VALUE))return multiplier.isOdd()?MIN_VALUE:ZERO;if(multiplier.eq(MIN_VALUE))return this.isOdd()?MIN_VALUE:ZERO;if(this.isNegative()){if(multiplier.isNegative())return this.neg().mul(multiplier.neg());else return this.neg().mul(multiplier).neg()}else if(multiplier.isNegative())return this.mul(multiplier.neg()).neg();if(this.lt(TWO_PWR_24)&&multiplier.lt(TWO_PWR_24))return fromNumber(this.toNumber()*multiplier.toNumber(),this.unsigned);var a48=this.high>>>16;var a32=this.high&65535;var a16=this.low>>>16;var a00=this.low&65535;var b48=multiplier.high>>>16;var b32=multiplier.high&65535;var b16=multiplier.low>>>16;var b00=multiplier.low&65535;var c48=0,c32=0,c16=0,c00=0;c00+=a00*b00;c16+=c00>>>16;c00&=65535;c16+=a16*b00;c32+=c16>>>16;c16&=65535;c16+=a00*b16;c32+=c16>>>16;c16&=65535;c32+=a32*b00;c48+=c32>>>16;c32&=65535;c32+=a16*b16;c48+=c32>>>16;c32&=65535;c32+=a00*b32;c48+=c32>>>16;c32&=65535;c48+=a48*b00+a32*b16+a16*b32+a00*b48;c48&=65535;return fromBits(c16<<16|c00,c48<<16|c32,this.unsigned)};LongPrototype.mul=LongPrototype.multiply;LongPrototype.divide=function divide(divisor){if(!isLong(divisor))divisor=fromValue(divisor);if(divisor.isZero())throw Error("division by zero");if(this.isZero())return this.unsigned?UZERO:ZERO;var approx,rem,res;if(!this.unsigned){if(this.eq(MIN_VALUE)){if(divisor.eq(ONE)||divisor.eq(NEG_ONE))return MIN_VALUE;else if(divisor.eq(MIN_VALUE))return ONE;else{var halfThis=this.shr(1);approx=halfThis.div(divisor).shl(1);if(approx.eq(ZERO)){return divisor.isNegative()?ONE:NEG_ONE}else{rem=this.sub(divisor.mul(approx));res=approx.add(rem.div(divisor));return res}}}else if(divisor.eq(MIN_VALUE))return this.unsigned?UZERO:ZERO;if(this.isNegative()){if(divisor.isNegative())return this.neg().div(divisor.neg());return this.neg().div(divisor).neg()}else if(divisor.isNegative())return this.div(divisor.neg()).neg();res=ZERO}else{if(!divisor.unsigned)divisor=divisor.toUnsigned();if(divisor.gt(this))return UZERO;if(divisor.gt(this.shru(1)))return UONE;res=UZERO}rem=this;while(rem.gte(divisor)){approx=Math.max(1,Math.floor(rem.toNumber()/divisor.toNumber()));var log2=Math.ceil(Math.log(approx)/Math.LN2),delta=log2<=48?1:pow_dbl(2,log2-48),approxRes=fromNumber(approx),approxRem=approxRes.mul(divisor);while(approxRem.isNegative()||approxRem.gt(rem)){approx-=delta;approxRes=fromNumber(approx,this.unsigned);approxRem=approxRes.mul(divisor)}if(approxRes.isZero())approxRes=ONE;res=res.add(approxRes);rem=rem.sub(approxRem)}return res};LongPrototype.div=LongPrototype.divide;LongPrototype.modulo=function modulo(divisor){if(!isLong(divisor))divisor=fromValue(divisor);return this.sub(this.div(divisor).mul(divisor))};LongPrototype.mod=LongPrototype.modulo;LongPrototype.not=function not(){return fromBits(~this.low,~this.high,this.unsigned)};LongPrototype.and=function and(other){if(!isLong(other))other=fromValue(other);return fromBits(this.low&other.low,this.high&other.high,this.unsigned)};LongPrototype.or=function or(other){if(!isLong(other))other=fromValue(other);return fromBits(this.low|other.low,this.high|other.high,this.unsigned)};LongPrototype.xor=function xor(other){if(!isLong(other))other=fromValue(other);return fromBits(this.low^other.low,this.high^other.high,this.unsigned)};LongPrototype.shiftLeft=function shiftLeft(numBits){if(isLong(numBits))numBits=numBits.toInt();if((numBits&=63)===0)return this;else if(numBits<32)return fromBits(this.low<<numBits,this.high<<numBits|this.low>>>32-numBits,this.unsigned);else return fromBits(0,this.low<<numBits-32,this.unsigned)};LongPrototype.shl=LongPrototype.shiftLeft;LongPrototype.shiftRight=function shiftRight(numBits){if(isLong(numBits))numBits=numBits.toInt();if((numBits&=63)===0)return this;else if(numBits<32)return fromBits(this.low>>>numBits|this.high<<32-numBits,this.high>>numBits,this.unsigned);else return fromBits(this.high>>numBits-32,this.high>=0?0:-1,this.unsigned)};LongPrototype.shr=LongPrototype.shiftRight;LongPrototype.shiftRightUnsigned=function shiftRightUnsigned(numBits){if(isLong(numBits))numBits=numBits.toInt();numBits&=63;if(numBits===0)return this;else{var high=this.high;if(numBits<32){var low=this.low;return fromBits(low>>>numBits|high<<32-numBits,high>>>numBits,this.unsigned)}else if(numBits===32)return fromBits(high,0,this.unsigned);else return fromBits(high>>>numBits-32,0,this.unsigned)}};LongPrototype.shru=LongPrototype.shiftRightUnsigned;LongPrototype.toSigned=function toSigned(){if(!this.unsigned)return this;return fromBits(this.low,this.high,false)};LongPrototype.toUnsigned=function toUnsigned(){if(this.unsigned)return this;return fromBits(this.low,this.high,true)};LongPrototype.toBytes=function(le){return le?this.toBytesLE():this.toBytesBE()};LongPrototype.toBytesLE=function(){var hi=this.high,lo=this.low;return[lo&255,lo>>>8&255,lo>>>16&255,lo>>>24&255,hi&255,hi>>>8&255,hi>>>16&255,hi>>>24&255]};LongPrototype.toBytesBE=function(){var hi=this.high,lo=this.low;return[hi>>>24&255,hi>>>16&255,hi>>>8&255,hi&255,lo>>>24&255,lo>>>16&255,lo>>>8&255,lo&255]};return Long})},{}],2:[function(require,module,exports){function add(x,y,base){var z=[];var n=Math.max(x.length,y.length);var carry=0;var i=0;while(i<n||carry){var xi=i<x.length?x[i]:0;var yi=i<y.length?y[i]:0;var zi=carry+xi+yi;z.push(zi%base);carry=Math.floor(zi/base);i++}return z}function multiplyByNumber(num,x,base){if(num<0)return null;if(num==0)return[];var result=[];var power=x;while(true){if(num&1){result=add(result,power,base)}num=num>>1;if(num===0)break;power=add(power,power,base)}return result}function parseToDigitsArray(str,base){var digits=str.split("");var ary=[];for(var i=digits.length-1;i>=0;i--){var n=parseInt(digits[i],base);if(isNaN(n))return null;ary.push(n)}return ary}function convertBase(str,fromBase,toBase){var digits=parseToDigitsArray(str,fromBase);if(digits===null)return null;var outArray=[];var power=[1];for(var i=0;i<digits.length;i++){if(digits[i]){outArray=add(outArray,multiplyByNumber(digits[i],power,toBase),toBase)}power=multiplyByNumber(fromBase,power,toBase)}var out="";for(var i=outArray.length-1;i>=0;i--){out+=outArray[i].toString(toBase)}return out}function decToHex(decStr){var hex=convertBase(decStr,10,16);return hex}function hexToDec(hexStr){if(hexStr.substring(0,2)==="0x")hexStr=hexStr.substring(2);hexStr=hexStr.toLowerCase();return convertBase(hexStr,16,10)}(function(exports){"use strict";var S2=exports.S2={L:{}};S2.L.LatLng=function(rawLat,rawLng,noWrap){var lat=parseFloat(rawLat,10);var lng=parseFloat(rawLng,10);if(isNaN(lat)||isNaN(lng)){throw new Error("Invalid LatLng object: ("+rawLat+", "+rawLng+")")}if(noWrap!==true){lat=Math.max(Math.min(lat,90),-90);lng=(lng+180)%360+(lng<-180||lng===180?180:-180)}return{lat:lat,lng:lng}};S2.L.LatLng.DEG_TO_RAD=Math.PI/180;S2.L.LatLng.RAD_TO_DEG=180/Math.PI;S2.LatLngToXYZ=function(latLng){var d2r=S2.L.LatLng.DEG_TO_RAD;var phi=latLng.lat*d2r;var theta=latLng.lng*d2r;var cosphi=Math.cos(phi);return[Math.cos(theta)*cosphi,Math.sin(theta)*cosphi,Math.sin(phi)]};S2.XYZToLatLng=function(xyz){var r2d=S2.L.LatLng.RAD_TO_DEG;var lat=Math.atan2(xyz[2],Math.sqrt(xyz[0]*xyz[0]+xyz[1]*xyz[1]));var lng=Math.atan2(xyz[1],xyz[0]);return S2.L.LatLng(lat*r2d,lng*r2d)};var largestAbsComponent=function(xyz){var temp=[Math.abs(xyz[0]),Math.abs(xyz[1]),Math.abs(xyz[2])];if(temp[0]>temp[1]){if(temp[0]>temp[2]){return 0}else{return 2}}else{if(temp[1]>temp[2]){return 1}else{return 2}}};var faceXYZToUV=function(face,xyz){var u,v;switch(face){case 0:u=xyz[1]/xyz[0];v=xyz[2]/xyz[0];break;case 1:u=-xyz[0]/xyz[1];v=xyz[2]/xyz[1];break;case 2:u=-xyz[0]/xyz[2];v=-xyz[1]/xyz[2];break;case 3:u=xyz[2]/xyz[0];v=xyz[1]/xyz[0];break;case 4:u=xyz[2]/xyz[1];v=-xyz[0]/xyz[1];break;case 5:u=-xyz[1]/xyz[2];v=-xyz[0]/xyz[2];break;default:throw{error:"Invalid face"}}return[u,v]};S2.XYZToFaceUV=function(xyz){var face=largestAbsComponent(xyz);if(xyz[face]<0){face+=3}var uv=faceXYZToUV(face,xyz);return[face,uv]};S2.FaceUVToXYZ=function(face,uv){var u=uv[0];var v=uv[1];switch(face){case 0:return[1,u,v];case 1:return[-u,1,v];case 2:return[-u,-v,1];case 3:return[-1,-v,-u];case 4:return[v,-1,-u];case 5:return[v,u,-1];default:throw{error:"Invalid face"}}};var singleSTtoUV=function(st){if(st>=.5){return 1/3*(4*st*st-1)}else{return 1/3*(1-4*(1-st)*(1-st))}};S2.STToUV=function(st){return[singleSTtoUV(st[0]),singleSTtoUV(st[1])]};var singleUVtoST=function(uv){if(uv>=0){return.5*Math.sqrt(1+3*uv)}else{return 1-.5*Math.sqrt(1-3*uv)}};S2.UVToST=function(uv){return[singleUVtoST(uv[0]),singleUVtoST(uv[1])]};S2.STToIJ=function(st,order){var maxSize=1<<order;var singleSTtoIJ=function(st){var ij=Math.floor(st*maxSize);return Math.max(0,Math.min(maxSize-1,ij))};return[singleSTtoIJ(st[0]),singleSTtoIJ(st[1])]};S2.IJToST=function(ij,order,offsets){var maxSize=1<<order;return[(ij[0]+offsets[0])/maxSize,(ij[1]+offsets[1])/maxSize]};var rotateAndFlipQuadrant=function(n,point,rx,ry){var newX,newY;if(ry==0){if(rx==1){point.x=n-1-point.x;point.y=n-1-point.y}var x=point.x;point.x=point.y;point.y=x}};var pointToHilbertQuadList=function(x,y,order,face){var hilbertMap={a:[[0,"d"],[1,"a"],[3,"b"],[2,"a"]],b:[[2,"b"],[1,"b"],[3,"a"],[0,"c"]],c:[[2,"c"],[3,"d"],[1,"c"],[0,"b"]],d:[[0,"a"],[3,"c"],[1,"d"],[2,"d"]]};if("number"!==typeof face){console.warn(new Error("called pointToHilbertQuadList without face value, defaulting to '0'").stack)}var currentSquare=face%2?"d":"a";var positions=[];for(var i=order-1;i>=0;i--){var mask=1<<i;var quad_x=x&mask?1:0;var quad_y=y&mask?1:0;var t=hilbertMap[currentSquare][quad_x*2+quad_y];positions.push(t[0]);currentSquare=t[1]}return positions};S2.S2Cell=function(){};S2.S2Cell.FromHilbertQuadKey=function(hilbertQuadkey){var parts=hilbertQuadkey.split("/");var face=parseInt(parts[0]);var position=parts[1];var maxLevel=position.length;var point={x:0,y:0};var i;var level;var bit;var rx,ry;var val;for(i=maxLevel-1;i>=0;i--){level=maxLevel-i;bit=position[i];rx=0;ry=0;if(bit==="1"){ry=1}else if(bit==="2"){rx=1;ry=1}else if(bit==="3"){rx=1}val=Math.pow(2,level-1);rotateAndFlipQuadrant(val,point,rx,ry);point.x+=val*rx;point.y+=val*ry}if(face%2===1){var t=point.x;point.x=point.y;point.y=t}return S2.S2Cell.FromFaceIJ(parseInt(face),[point.x,point.y],level)};S2.S2Cell.FromLatLng=function(latLng,level){if(!latLng.lat&&latLng.lat!==0||!latLng.lng&&latLng.lng!==0){throw new Error("Pass { lat: lat, lng: lng } to S2.S2Cell.FromLatLng")}var xyz=S2.LatLngToXYZ(latLng);var faceuv=S2.XYZToFaceUV(xyz);var st=S2.UVToST(faceuv[1]);var ij=S2.STToIJ(st,level);return S2.S2Cell.FromFaceIJ(faceuv[0],ij,level)};S2.S2Cell.FromFaceIJ=function(face,ij,level){var cell=new S2.S2Cell;cell.face=face;cell.ij=ij;cell.level=level;return cell};S2.S2Cell.prototype.toString=function(){return"F"+this.face+"ij["+this.ij[0]+","+this.ij[1]+"]@"+this.level};S2.S2Cell.prototype.getLatLng=function(){var st=S2.IJToST(this.ij,this.level,[.5,.5]);var uv=S2.STToUV(st);var xyz=S2.FaceUVToXYZ(this.face,uv);return S2.XYZToLatLng(xyz)};S2.S2Cell.prototype.getCornerLatLngs=function(){var result=[];var offsets=[[0,0],[0,1],[1,1],[1,0]];for(var i=0;i<4;i++){var st=S2.IJToST(this.ij,this.level,offsets[i]);var uv=S2.STToUV(st);var xyz=S2.FaceUVToXYZ(this.face,uv);result.push(S2.XYZToLatLng(xyz))}return result};S2.S2Cell.prototype.getFaceAndQuads=function(){var quads=pointToHilbertQuadList(this.ij[0],this.ij[1],this.level,this.face);return[this.face,quads]};S2.S2Cell.prototype.toHilbertQuadkey=function(){var quads=pointToHilbertQuadList(this.ij[0],this.ij[1],this.level,this.face);return this.face.toString(10)+"/"+quads.join("")};S2.latLngToNeighborKeys=S2.S2Cell.latLngToNeighborKeys=function(lat,lng,level){return S2.S2Cell.FromLatLng({lat:lat,lng:lng},level).getNeighbors().map(function(cell){return cell.toHilbertQuadkey()})};S2.S2Cell.prototype.getNeighbors=function(){var fromFaceIJWrap=function(face,ij,level){var maxSize=1<<level;if(ij[0]>=0&&ij[1]>=0&&ij[0]<maxSize&&ij[1]<maxSize){return S2.S2Cell.FromFaceIJ(face,ij,level)}else{var st=S2.IJToST(ij,level,[.5,.5]);var uv=S2.STToUV(st);var xyz=S2.FaceUVToXYZ(face,uv);var faceuv=S2.XYZToFaceUV(xyz);face=faceuv[0];uv=faceuv[1];st=S2.UVToST(uv);ij=S2.STToIJ(st,level);return S2.S2Cell.FromFaceIJ(face,ij,level)}};var face=this.face;var i=this.ij[0];var j=this.ij[1];var level=this.level;return[fromFaceIJWrap(face,[i-1,j],level),fromFaceIJWrap(face,[i,j-1],level),fromFaceIJWrap(face,[i+1,j],level),fromFaceIJWrap(face,[i,j+1],level)]};S2.FACE_BITS=3;S2.MAX_LEVEL=30;S2.POS_BITS=2*S2.MAX_LEVEL+1;S2.facePosLevelToId=S2.S2Cell.facePosLevelToId=S2.fromFacePosLevel=function(faceN,posS,levelN){var Long=exports.dcodeIO&&exports.dcodeIO.Long||require("long");var faceB;var posB;var bin;if(!levelN){levelN=posS.length}if(posS.length>levelN){posS=posS.substr(0,levelN)}faceB=Long.fromString(faceN.toString(10),true,10).toString(2);while(faceB.length<S2.FACE_BITS){faceB="0"+faceB}posB=Long.fromString(posS,true,4).toString(2);while(posB.length<2*levelN){posB="0"+posB}bin=faceB+posB;bin+="1";while(bin.length<S2.FACE_BITS+S2.POS_BITS){bin+="0"}return Long.fromString(bin,true,2).toString(10)};S2.keyToId=S2.S2Cell.keyToId=S2.toId=S2.toCellId=S2.fromKey=function(key){var parts=key.split("/");return S2.fromFacePosLevel(parts[0],parts[1],parts[1].length)};S2.tokenToKey=function(idS){var Long=exports.dcodeIO&&exports.dcodeIO.Long||require("long");var bin=Long.fromString(idS,true,16).toString(2);while(bin.length<S2.FACE_BITS+S2.POS_BITS){bin="0"+bin}var lsbIndex=bin.lastIndexOf("1");var faceB=bin.substring(0,3);var posB=bin.substring(3,lsbIndex);var levelN=posB.length/2;var faceS=Long.fromString(faceB,true,2).toString(10);var posS=Long.fromString(posB,true,2).toString(4);while(posS.length<levelN){posS="0"+posS}return faceS+"/"+posS};S2.idToKey=S2.S2Cell.idToKey=S2.S2Cell.toKey=S2.toKey=S2.fromId=S2.fromCellId=S2.S2Cell.toHilbertQuadkey=S2.toHilbertQuadkey=function(idS){var Long=exports.dcodeIO&&exports.dcodeIO.Long||require("long");var bin=Long.fromString(idS,true,10).toString(2);while(bin.length<S2.FACE_BITS+S2.POS_BITS){bin="0"+bin}var lsbIndex=bin.lastIndexOf("1");var faceB=bin.substring(0,3);var posB=bin.substring(3,lsbIndex);var levelN=posB.length/2;var faceS=Long.fromString(faceB,true,2).toString(10);var posS=Long.fromString(posB,true,2).toString(4);while(posS.length<levelN){posS="0"+posS}return faceS+"/"+posS};S2.keyToLatLng=S2.S2Cell.keyToLatLng=function(key){var cell2=S2.S2Cell.FromHilbertQuadKey(key);return cell2.getLatLng()};S2.idToLatLng=S2.S2Cell.idToLatLng=function(id){var key=S2.idToKey(id);return S2.keyToLatLng(key)};S2.tokenToLatLng=S2.S2Cell.tokenToLatLng=function(id){while(id.length<16)id+="0";var key=S2.tokenToKey(id);return S2.keyToLatLng(key)};S2.latLngToToken=S2.S2Cell.latLngToToken=function(lat,lng,level){var id=S2.keyToId(S2.S2Cell.FromLatLng({lat:lat,lng:lng},level).toHilbertQuadkey());var token=decToHex(id);while(token.length<16)token="0"+token;return token.slice(0,level/2+1)};S2.S2Cell.latLngToKey=S2.latLngToKey=S2.latLngToQuadkey=function(lat,lng,level){if(isNaN(level)||level<1||level>30){throw new Error("'level' is not a number between 1 and 30 (but it should be)")}return S2.S2Cell.FromLatLng({lat:lat,lng:lng},level).toHilbertQuadkey()};S2.stepKey=function(key,num){var Long=exports.dcodeIO&&exports.dcodeIO.Long||require("long");var parts=key.split("/");var faceS=parts[0];var posS=parts[1];var level=parts[1].length;var posL=Long.fromString(posS,true,4);var otherL;if(num>0){otherL=posL.add(Math.abs(num))}else if(num<0){otherL=posL.subtract(Math.abs(num))}var otherS=otherL.toString(4);if("0"===otherS){console.warning(new Error("face/position wrapping is not yet supported"))}while(otherS.length<level){otherS="0"+otherS}return faceS+"/"+otherS};S2.S2Cell.prevKey=S2.prevKey=function(key){return S2.stepKey(key,-1)};S2.S2Cell.nextKey=S2.nextKey=function(key){return S2.stepKey(key,1)}})("undefined"!==typeof module?module.exports:window)},{"long":1}]},{},[2])(2)});