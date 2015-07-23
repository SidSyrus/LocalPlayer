'use strict';

(function($){
	function load(){
		gapi.client.setApiKey('AIzaSyBEZBDf9MFGDBHF1jq1lGC0dpUocPSrdow');
		gapi.client.load('youtube', 'v3').then(function(){console.log('loaded')});
	}

	$.getScript('js/gapi.min.js')
	.done(function(e){
		$.getScript('js/gapi.loaded.min.js')
		.done(function(e){load()})
		.fail(function(e){console.log("Failed - " + e)});
	})
	.fail(function(e){console.log(e.error)});

})(jQuery)