// YOUTUBE API 
//https://stackoverflow.com/questions/43839217/how-do-i-retrieve-my-youtube-channel-playlists
// BY CHANNEL
//https://content.googleapis.com/youtube/v3/channels?id=UC_x5XG1OV2P6uZZ5FSM9Ttw&part=snippet%2CcontentDetails%2Cstatistics&key=12345
// FOR USERNAME
//https://content.googleapis.com/youtube/v3/channels?forUsername=ginocote&part=snippet%2CcontentDetails%2Cstatistics&key=12345

// THEN GET BY UPLOAD ID AND LOAD API playlistItems 

// BY CHANNEL ID GET ALL
//https://content.googleapis.com/youtube/v3/playlists?channelId=UC-VKI9vpl2tSyv0FK9E1-KA&maxResults=50&part=snippet&key=12345

var addbuttons = true ;

var players = plyr.setup(".js-player",{
  hideControls: true,
  settings:[],
  autoplay: true,
  controls: []
});

function shorten_nicely_with_ellipsis(){
    var str = arguments[1];
    var truncating = !!arguments[2];

    // If we're not already breaking on a whitespace character, loop
    // backwards over the string, and break on the first character of
    // the first group of whitespace characters we find. 
    if( truncating && !arguments[2].match(/^\s/) ) {
        for(var i=str.length; --i; i<=1) {
            if( str[i].match(/\s/) && !str[i-1].match(/\s/) ) {
                str = arguments[1].substr(0, i);
                break;
            }
        }
    }

    if( truncating ) {                
        str = str + '...';
    }

    return str;
}

/* PLAYLIST  */
var myPlaylist = [];

// setTimeout(function(){

//   //$("li.pls-playing").removeClass("pls-playing");
//   //$(".plyr-playlist-wrapper").remove();

//   var target = ".js-player";
//   //var limit = 50;
//   var apikey = "AIzaSyDDBk8tAkod1VRRNyFZF09fgQyMpnSe5HI";

//   loadPlaylist(target, apikey, 10, myPlaylist); 
  
// }, 5000);
//   // scrollTo BUG

/****************************************************************************************/
// var myPlaylist = ""; 
// uncomment this ↑ for your Youtube playlist | change de playlist id data-ytpls in the html
// Load json playlist OR Youtube api 3. Playlist WILL NOT WORK WITH THIS API KEY
/****************************************************************************************/
var apikey = "AIzaSyAjzcz852C9z8p1N8QMBytPRFQpiwmU4Jo"; // GET YOUR YOUTUBE API KEY
//var apikey = ""; // ONLY FOR MY CUSTOM PLAYLIST NO NEED FOR YOUTUBE API KEY
var target = ".js-player";
var limit = 30;

$(document).ready(function(){
  // loadPlaylist(target, apikey, limit = 20, myPlaylist); // LOAD JSON PLAYLIST
  loadPlaylist(target, apikey, limit, myPlaylist);  // LOAD YOUTUBE OR USER VIDEO LIST
  
}); // JQUERY READY END

function loadPlaylist(target, apikey, limit = 20, myPlaylist) {
  
  $("li.pls-playing").removeClass("pls-playing");
  $(".plyr-playlist-wrapper").remove();

  limit = limit-1;
  
  // GET YOUTUBE PLAYLIST
  //var getPlaylist = $("div[data-type='youtube']").eq(0).data("ytpls");
  //var getPlaylist = $("[data-type='youtube']").data("playlist");
  //var getPlaylist = $(".js-player").eq(0).data("playlist");
  
  if (myPlaylist.length>0) {

    PlyrPlaylist(".plyr-playlist", myPlaylist, limit);
    //return 
  } else{
    
    var ytplaylist = $(target).attr("data-ytpls");
    var ytuser = $(target).attr("data-user");

    //if ($('.js-player[data-ytpls]').length > 0){
    if (ytplaylist) {
      getTYPlaylist(ytplaylist, apikey, limit)
      //alert(ytplaylist);
    } else if (ytuser) {
      alert(ytuser);
    }
    
  }
    
//typeof $getYTPls === "undefined") return;

  //var getPlaylist = $(".js-player").eq(0).data("playlist");
//   var $getData = $(".js-player").eq(0);

//   var $getYTPls = $getData.data("ytpls");

  //alert(getPlaylist);
  //console.log(myPlaylist[0]);

  //if (typeof $getYTPls === "undefined") return;

  //var apikey = "AIzaSyB64VbCIHW48wwarovz64tcsRaZrciFkWM";
  //
  //var playlistId = "RDQMyFModNyxXx8";
  //var playlistId = $getYTPls;

  //"https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&id=YOUR-PLAYLIST-ID&key={YOUR_API_KEY}"

function getTYPlaylist(playlistId, apikey, limit) {
  
  console.log("https://content.googleapis.com/youtube/v3/playlistItems?&key=" +
      apikey +
      "&maxResults=" +
      limit +
      "&part=id,snippet&playlistId=" +
      playlistId +
      "&type=video");
  
  $.ajax({
    url:
      "https://content.googleapis.com/youtube/v3/playlistItems?&key=" +
      apikey +
      "&maxResults=" +
      limit +
      "&part=id,snippet&playlistId=" +
      playlistId +
      "&type=video",
    dataType: "jsonp",
    success: function(data) {
      console.log(data.items);
      //console.log(data.items[0].snippet.title);

      resultData = youtubeParser(data);

      console.log(resultData);

      PlyrPlaylist(".plyr-playlist", resultData, limit);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      alert(textStatus, +" | " + errorThrown);
    }
  });
  
}

  //PlyrPlaylist(".plyr-playlist", myPlaylist);

  function PlyrPlaylist(target, myPlaylist, limit) {
    $('<div class="plyr-playlist-wrapper"><ul class="plyr-playlist"></ul></div>').insertAfter("#player");

    var startwith = 0; // Maybe a playlist option to start with choosen video

    var playingclass = "";
    var items = [];
    //var playing == 1 ;
    $.each(myPlaylist, function(id, val) {
      //items.push('<li>' + option.title + '</li>');
      //alert(id)

      //console.log(val);

      if (0 === id) playingclass = "pls-playing";
      else playingclass = "";

      if(!val.poster){
        val.poster = " data:image/png;base64,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";
      }
      
      items.push(
        '<li class="' +playingclass +'"><a href="javascript:void(0)" data-type="' +val.sources[0].type +'" data-video-id="' +val.sources[0].src +'"><img class="plyr-miniposter" src="' + val.poster + '"> ' +
val.title.replace(/(^.{0,35})(.*)/, shorten_nicely_with_ellipsis) +"</a></li> ");
      
      if (id == limit) 
        return false;
      
    });
    $(target).html(items.join(""));
    
    setTimeout(function(){ 
      //$(target+" .pls-playing").find("a").trigger("click");
      
    }, 600);
    
    // players[0].on("isReady", function(event) {
    //   alert("isReady")
    //   $(target+" .pls-playing").find("a").trigger("click");
    // });
    
  // players[0].on("ready", function(event) {
  //   //$(".plyr-playlist .pls-playing").find("a").one().trigger("click");
  //   //players[0].play();
  //   $(target+" .pls-playing").find("a").trigger("click");
  // });

    // hack, play the first video in the playlist
    // setTimeout(function(){ 
    //       $(target).find("a").trigger("click");
    // }, 500);

    //   var getObj = myPlaylist[startwith];

    //   var video_id = getObj.youtube;
    //   var video_title = getObj.title;

    //   alert(video_id)

    //   console.log(video_id);

    //   //console.log(myPlaylist[0]);

    //   players[0].source({
    //     type: "video",
    //     title: "video_title",
    //     sources: [{ src: "cLcKew4cQq4", type: "youtube" }]
    //   });

    //console.log(items[0]);
  }

  players[0].on("ready", function(event) {
    //$(".plyr-playlist .pls-playing").find("a").one().trigger("click");
    console.log("Ready.....................................................");
    players[0].play();
    
    
    if(addbuttons){
      
      $(".plyr-playlist .pls-playing").find("a").trigger("click");
      
      $('<button type="button" class="plyr-prev"><i class="fa fa-step-backward fa-lg"></i></button>').insertBefore('.plyr__controls [data-plyr="play"]');

      $('<button type="button" class="plyr-next"><i class="fa fa-step-forward fa-lg"></i></button>').insertAfter('.plyr__controls [data-plyr="pause"]');
      
      addbuttons = false ;
    }
    
  }).on("ended", function(event) {
    var $next = $(".plyr-playlist .pls-playing")
      .next()
      .find("a")
      .trigger("click");
    //$next.parent().addClass("pls-playing");
  });

    // hack, play the first video in the playlist
    //$(".plyr-playlist .pls-playing").find("a").trigger("click");
    //$(target).find("pls-playing a").trigger("click");
    // setTimeout(function(){ 
    //       $(".plyr-playlist .pls-playing").find("a").trigger("click");
    // }, 500);

  $(document).on("click", "ul.plyr-playlist li a", function(event) {
    //$("ul.plyr-playlist li a").on("click", function(event) {
    event.preventDefault();

    $("li.pls-playing").removeClass("pls-playing");
    $(this)
      .parent()
      .addClass("pls-playing");

    var video_id = $(this).data("video-id");
    var video_type = $(this).data("type");
    var video_title = $(this).text();

    //alert(video_id);

    players[0].source({
      type: "video",
      title: "video_title",
      sources: [{ src: video_id, type: video_type }]
    });

    //ScrollTo($(".pls-playing").attr("href"), 500,0,10);

    $(".plyr-playlist").scrollTo(".pls-playing", 300);

    // players[0].on("ended", function(event) {
    //   console.log("test");
    // });
  })
  .on("click", ".plyr-prev", function(event) {
    var $next = $(".plyr-playlist .pls-playing")
      .prev()
      .find("a")
      .trigger("click");
  })
  .on("click", ".plyr-next", function(event) {
    var $next = $(".plyr-playlist .pls-playing")
      .next()
      .find("a")
      .trigger("click");
  });

  ///////////////////////

  // GET YOUTUBE PLAYLIST
  /* YOUTUBE PLAYLIST PARSER */
  // http://jsfiddle.net/onigetoc/cb2u1y4k/
  function youtubeParser(data) {
    var new_Data = data.items.map(function(item) {
      var thumb;

      if (item.snippet.thumbnails) {
        if (item.snippet.thumbnails.default)
          //live?
          thumb = item.snippet.thumbnails.default.url;

        if (item.snippet.thumbnails.medium)
          //live?
          thumb = item.snippet.thumbnails.default.url;
      }

      return {
        //type: "youtube",
        title: item.snippet.title,
        description: item.snippet.description,
        author: item.snippet.channelTitle,
        sources: [{ 
          src: item.snippet.resourceId.videoId, 
          type: item.kind.split('#')[0] 
        }],
        poster: thumb
      };
    });

    console.log(new_Data);

    // var output = {
    //   item: new_Data
    // };

    return new_Data;
  }
}

/****** GC ScrollTo **********/
// mine: https://jsfiddle.net/onigetoc/5kh0e5f4/
// https://stackoverflow.com/questions/2346011/how-do-i-scroll-to-an-element-within-an-overflowed-div
jQuery.fn.scrollTo = function(elem, speed, margin) {
  jQuery(this).animate(
    {
      scrollTop:
        jQuery(this).scrollTop() -
        jQuery(this).offset().top +
        jQuery(elem).offset().top
    },
    speed == undefined ? 1000 : speed
  );
  return this;
};