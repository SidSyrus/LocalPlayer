var app = angular.module('YouTube-local',[]);

app.run(function () {
  var script = document.createElement('script');
  script.src = "https://www.youtube.com/iframe_api";
  var scriptTag = document.getElementsByTagName('script')[0];
  scriptTag.parentNode.insertBefore(script, scriptTag);
});


app.service('YTService', ['$window', '$rootScope', '$log', function ($window, $rootScope, $log) {

  var service = this;

  var YTPlayer = {
    ready: false,
    player: null,
    playerId: null,
    videoId: null,
    videoTitle: null,
    playerHeight: '480',
    playerWidth: '640'
  };
  var results = [];

  $window.onYouTubeIframeAPIReady = function () {
    YTPlayer.ready = true;
    YTPlayer.playerId = 'player';
    service.setPlayer();
    $rootScope.$apply();
  };

  this.setPlayer = function () {
    if (YTPlayer.ready && YTPlayer.playerId) {
      if (YTPlayer.player) {
        YTPlayer.player.destroy();
      }
      YTPlayer.player = service.createPlayer();
    }
  };

  this.createPlayer = function () {
    return new YT.Player(YTPlayer.playerId, {
      height: YTPlayer.playerHeight,
      width: YTPlayer.playerWidth,
      playerVars: {
        rel: 0,
        showinfo: 0
      }
    });
  };

  this.launchPlayer = function (id, title) {
    YTPlayer.player.loadVideoById(id);
    YTPlayer.videoId = id;
    YTPlayer.videoTitle = title;
    return YTPlayer;
  }

  this.listResults = function (data) {
    if (YTPlayer.player) {
        YTPlayer.player.stopVideo();
      }
    results.length = 0;
    for (var i=0; i <= data.items.length - 1; i++) {
      results.push({
        id: data.items[i].id.videoId,
        title: data.items[i].snippet.title,
        description: data.items[i].snippet.description,
        thumbnail: data.items[i].snippet.thumbnails.default.url,
        author: data.items[i].snippet.channelTitle
      });
    }
    return results;
  }

  this.getPlayer = function () {
    return YTPlayer;
  };

  this.getResults = function () {
    return results;
  };


}]);

app.controller('YTController', [ '$scope', '$http', '$log', 'YTService', function ($scope, $http, $log, YTService) {

    initialize();

    $scope.search = function () {
      $scope.youtube.videoId = null;
      $http.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          key: 'AIzaSyBEZBDf9MFGDBHF1jq1lGC0dpUocPSrdow',
          type: 'video',
          maxResults: '10',
          part: 'id,snippet',
          fields: 'items/id,items/snippet/title,items/snippet/description,items/snippet/thumbnails/default,items/snippet/channelTitle',
          q: this.query
        }
      })
      .success( function (data) {
        YTService.listResults(data);
      })
      .error( function (error) {
        $log.info('Something went wrong. Error message : ' + error.error.message + ' | Error reason : ' + error.error.errors[0].reason);
      });
    }

    $scope.play = function(id, title){    
    	$scope.results.length = 0;
  		YTService.launchPlayer(id, title);
  	}

    function initialize() {
      $scope.youtube = YTService.getPlayer();
      $scope.results = YTService.getResults();
    }
}]);