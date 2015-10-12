var app = angular.module('YouTube-local',[]);

app.run(function () {
  var script = document.createElement('script');
  script.src = "https://www.youtube.com/iframe_api";
  var appendScriptTag = document.getElementsByTagName('script')[0];
  appendScriptTag.parentNode.insertBefore(script, appendScriptTag);
});
