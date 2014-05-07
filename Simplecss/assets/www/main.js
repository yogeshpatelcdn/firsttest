// QuickBlox application settings
var QB = {
	appId : '203',
	ownerId : '4431',
	authKey : '5a-YN-8saK8-yTs',
	authSecret : 'ttwUEV7rGGaOrnV'
}

// Script runs main() when when PhoneGap is fully loaded.
// http://docs.phonegap.com/en/1.4.1/phonegap_events_events.md.html#deviceready
function init() {
	document.addEventListener("deviceready", main, true);
//	$(document).ready(main);
}

function main() {
	$('#phoneGapStatus').html("it's working");
	
	// Show QuickBlox application parameters.
	$('#appId').html(QB.appId);
	$('#ownerId').html(QB.ownerId);
	$('#authKey').html(QB.authKey);
	$('#authSecret').html(QB.authSecret);
	
	authApp(appHasToken, errorCallback);
}

// Authenticate specified QuickBlox application.
// Calls successCallback if finished successfully, and errorCallback if not.
function authApp(successCallback, errorCallback) {
	var s = getSignature(); // gets signature
	
	// See more documentation on the wiki -- http://wiki.quickblox.com/Authentication_and_Authorization#API_Session_Creation
	var url = 'https://admin.quickblox.com/auth';
	var data = 'app_id=' + QB.appId + 
			'&auth_key=' + QB.authKey + 
			'&nonce=' + s.nonce + 
			'&timestamp=' + s.timestamp + 
			'&signature=' + s.signature;
	
	console.log('[DEBUG] Authenticate specified application: POST ' + url + '?' + data);
	
	$.ajax({
	  type: 'POST',
	  url: url,
	  data: data,
	  success: successCallback,
	  error: errorCallback
	});
}

// Calls when QuickBlox application authorize.
function appHasToken(xml) {
	// Finds token in retrieved xml response.
	var token = $(xml).find('token').text();

	console.log('[DEBUG] Your token: ' + token);

	$('#auth').unbind('click');
	$('#auth').click(function(){
		authUser(token);
	});

	$('#register').unbind('click');
	$('#register').click(function(){
		addUser(token);
	});
	
	$('#users a').die('click');
	$('#users a').live('click', function(){
		var userId = $(this).attr('id');
		deleteUser(token, userId);
	});

	getAllUsers(token);
}

function errorCallback(jqXHR, textStatus, errorThrown) {
	console.log('Error: ' + jqXHR.responseText);
	var errorMessage = jqXHR.responseText != ' ' ? jqXHR.responseText : jqXHR.statusText;  
	alert('Error: ' + errorMessage);
	console.log(jqXHR);
}

// Gets all users of QuickBlox application and prints them into the page.
function getAllUsers(token) {
	// See more documentation on the wiki -- http://wiki.quickblox.com/Users#Retrieve_API_Users_for_current_application
	var url = 'https://users.quickblox.com/users.json'
	var data = 'token=' + token;
	
	console.log('[DEBUG] Getting all users: GET ' + url + '?' + data);
	
	$.ajax({
		type: 'GET',
		url: url,
		data: data,
		success: function(response) {
			console.log('[DEBUG] Server response:');
			console.log(response);
			
			// Prints users list into the #users container.
			$('#users').html('');
			$('#usersCount').html(' (' + response.items.length + ')');
			$(response.items).each(function(index, current){
				var element = '<li>[<a href="#" id="' + current.id + '">delete</a>] (' + current.id + ') ' + current.login + '</li>';
				$('#users').append(element);
			});
			if (response.items.length == 0) {
				$('#users').append('<li><i>There are no users in application.</i></li>');
			}
		},
		error: errorCallback
	});
}

// Authenticates user.
function authUser(token) {
	var login = $('#login').val();
	var password = $('#password').val();
	
	// See more documentation on the wiki -- http://wiki.quickblox.com/Authentication_and_Authorization#API_User_Sign_In
	var url = 'https://users.quickblox.com/users/authenticate.json'
	var data = 'user[owner_id]=' + QB.ownerId + 
			'&login=' + login + 
			'&password=' + password +
			'&token=' + token;
	
	console.log('[DEBUG] Authenticate existing user: POST ' + url + '?' + data);
	
	$.ajax({
		type: 'POST',
		url: url,
		data: data,
		success: function(response) {
			console.log('[DEBUG] User has been successfully authenticated. Server response:');
			alert('[DEBUG] User has been successfully authenticated, user id = ' + response.id);
			console.log(response);
		},
		error: errorCallback
	});
}

// Adds new user.
function addUser(token) {
	var login = $('#new_login').val();
	var password = $('#new_password').val();
	
	// See more documentation on the wiki -- http://wiki.quickblox.com/Users#API_User_Sign_Up
	var url = 'https://users.quickblox.com/users.json'
	var data = 'user[owner_id]=' + QB.ownerId + 
			'&user[login]=' + login + 
			'&user[password]=' + password +
			'&token=' + token;
	
	console.log('[DEBUG] Add new user: POST ' + url + '?' + data);
	
	$.ajax({
		type: 'POST',
		url: url,
		data: data,
		success: function(response) {
			console.log('[DEBUG] User has been successfully added, server response:');
			console.log(response);
			alert('User has been successfully added, user id = ' + response.id);
			getAllUsers(token);
		},
		error: errorCallback
	});
}

// Deletes existing user by id.
function deleteUser(token, id) {
	
	// See more documentation on the wiki -- http://wiki.quickblox.com/Users#Delete_API_User_by_identifier
	var url = 'https://users.quickblox.com/users/' + id + '.json';
	var data = 'token=' + token;

	console.log('[DEBUG] Delete user: DELETE ' + url + '?' + data);

	$.ajax({
		type: 'DELETE',
		url: url,
		data: data,
		complete : function(jqXHR, textStatus) {
			console.log(jqXHR);
			alert(jqXHR.statusText + ' ' + jqXHR.status +  ' : ' + jqXHR.responseText);
			
			if (jqXHR.status == 200) {
				authApp(appHasToken, errorCallback);
			}
		}
	});
}

// Gets signature. Signature uses for application authentication.
function getSignature() {
	var nonce = Math.floor(Math.random() * 1000); // Gets random number (0;1000)
	var timestamp = Math.round((new Date()).getTime() / 1000); // Gets unix timestamp (http://en.wikipedia.org/wiki/Unix_time) 

	// Creating message where parameters are sorted by alphabetical order.
	var message = 'app_id=' + QB.appId + '&auth_key=' + QB.authKey + '&nonce=' + nonce + '&timestamp=' + timestamp;
	var secret = QB.authSecret;
	// Encrypting message with secret key from QuickBlox application parameters.
	var hmac = Crypto.HMAC(Crypto.SHA1, message, secret);
	
	var signatureObj = {
		nonce 		: nonce,
		timestamp 	: timestamp,
		signature 	: hmac
	};
	
	return signatureObj; 
}


/* Crypto-JS algorithm from http://crypto-js.googlecode.com/files/2.3.0-crypto-sha1-hmac.js */

/*
 * Crypto-JS v2.3.0
 * http://code.google.com/p/crypto-js/
 * Copyright (c) 2011, Jeff Mott. All rights reserved.
 * http://code.google.com/p/crypto-js/wiki/License
 */
if(typeof Crypto=="undefined"||!Crypto.util)(function(){var i=window.Crypto={},n=i.util={rotl:function(a,c){return a<<c|a>>>32-c},rotr:function(a,c){return a<<32-c|a>>>c},endian:function(a){if(a.constructor==Number)return n.rotl(a,8)&16711935|n.rotl(a,24)&4278255360;for(var c=0;c<a.length;c++)a[c]=n.endian(a[c]);return a},randomBytes:function(a){for(var c=[];a>0;a--)c.push(Math.floor(Math.random()*256));return c},bytesToWords:function(a){for(var c=[],b=0,d=0;b<a.length;b++,d+=8)c[d>>>5]|=a[b]<<24-
d%32;return c},wordsToBytes:function(a){for(var c=[],b=0;b<a.length*32;b+=8)c.push(a[b>>>5]>>>24-b%32&255);return c},bytesToHex:function(a){for(var c=[],b=0;b<a.length;b++){c.push((a[b]>>>4).toString(16));c.push((a[b]&15).toString(16))}return c.join("")},hexToBytes:function(a){for(var c=[],b=0;b<a.length;b+=2)c.push(parseInt(a.substr(b,2),16));return c},bytesToBase64:function(a){if(typeof btoa=="function")return btoa(j.bytesToString(a));for(var c=[],b=0;b<a.length;b+=3)for(var d=a[b]<<16|a[b+1]<<
8|a[b+2],e=0;e<4;e++)b*8+e*6<=a.length*8?c.push("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(d>>>6*(3-e)&63)):c.push("=");return c.join("")},base64ToBytes:function(a){if(typeof atob=="function")return j.stringToBytes(atob(a));a=a.replace(/[^A-Z0-9+\/]/ig,"");for(var c=[],b=0,d=0;b<a.length;d=++b%4)d!=0&&c.push(("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(a.charAt(b-1))&Math.pow(2,-2*d+8)-1)<<d*2|"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(a.charAt(b))>>>
6-d*2);return c}};i=i.charenc={};i.UTF8={stringToBytes:function(a){return j.stringToBytes(unescape(encodeURIComponent(a)))},bytesToString:function(a){return decodeURIComponent(escape(j.bytesToString(a)))}};var j=i.Binary={stringToBytes:function(a){for(var c=[],b=0;b<a.length;b++)c.push(a.charCodeAt(b)&255);return c},bytesToString:function(a){for(var c=[],b=0;b<a.length;b++)c.push(String.fromCharCode(a[b]));return c.join("")}}})();
(function(){var i=Crypto,n=i.util,j=i.charenc,a=j.UTF8,c=j.Binary,b=i.SHA1=function(d,e){var f=n.wordsToBytes(b._sha1(d));return e&&e.asBytes?f:e&&e.asString?c.bytesToString(f):n.bytesToHex(f)};b._sha1=function(d){if(d.constructor==String)d=a.stringToBytes(d);var e=n.bytesToWords(d),f=d.length*8;d=[];var k=1732584193,g=-271733879,l=-1732584194,m=271733878,o=-1009589776;e[f>>5]|=128<<24-f%32;e[(f+64>>>9<<4)+15]=f;for(f=0;f<e.length;f+=16){for(var q=k,r=g,s=l,t=m,u=o,h=0;h<80;h++){if(h<16)d[h]=e[f+
h];else{var p=d[h-3]^d[h-8]^d[h-14]^d[h-16];d[h]=p<<1|p>>>31}p=(k<<5|k>>>27)+o+(d[h]>>>0)+(h<20?(g&l|~g&m)+1518500249:h<40?(g^l^m)+1859775393:h<60?(g&l|g&m|l&m)-1894007588:(g^l^m)-899497514);o=m;m=l;l=g<<30|g>>>2;g=k;k=p}k+=q;g+=r;l+=s;m+=t;o+=u}return[k,g,l,m,o]};b._blocksize=16;b._digestsize=20})();
(function(){var i=Crypto,n=i.util,j=i.charenc,a=j.UTF8,c=j.Binary;i.HMAC=function(b,d,e,f){if(d.constructor==String)d=a.stringToBytes(d);if(e.constructor==String)e=a.stringToBytes(e);if(e.length>b._blocksize*4)e=b(e,{asBytes:true});var k=e.slice(0);e=e.slice(0);for(var g=0;g<b._blocksize*4;g++){k[g]^=92;e[g]^=54}b=b(k.concat(b(e.concat(d),{asBytes:true})),{asBytes:true});return f&&f.asBytes?b:f&&f.asString?c.bytesToString(b):n.bytesToHex(b)}})();