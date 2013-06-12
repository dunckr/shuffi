(function(){"use strict";var t="undefined"!=typeof window?window:global;if("function"!=typeof t.require){var e={},n={},i=function(t,e){return{}.hasOwnProperty.call(t,e)},r=function(t,e){var n,i,r=[];n=/^\.\.?(\/|$)/.test(e)?[t,e].join("/").split("/"):e.split("/");for(var o=0,s=n.length;s>o;o++)i=n[o],".."===i?r.pop():"."!==i&&""!==i&&r.push(i);return r.join("/")},o=function(t){return t.split("/").slice(0,-1).join("/")},s=function(e){return function(n){var i=o(e),s=r(i,n);return t.require(s)}},a=function(t,e){var i={id:t,exports:{}};e(i.exports,s(t),i);var r=n[t]=i.exports;return r},l=function(t){var o=r(t,".");if(i(n,o))return n[o];if(i(e,o))return a(o,e[o]);var s=r(o,"./index");if(i(n,s))return n[s];if(i(e,s))return a(s,e[s]);throw Error('Cannot find module "'+t+'"')},u=function(t,n){if("object"==typeof t)for(var r in t)i(t,r)&&(e[r]=t[r]);else e[t]=n};t.require=l,t.require.define=u,t.require.register=u,t.require.brunch=!0}})(),window.require.register("application",function(t,e,n){Application={initialize:function(){var t=e("models/list");this.list=new t;var n=e("views/nav_view");this.navView=new n({collection:this.list});var i=e("views/display_view");this.displayView=new i({collection:this.list});var r=e("models/player");this.player=new r({list:this.list});var o=e("views/control_view");this.controlView=new o({model:this.player}),"function"==typeof Object.freeze&&Object.freeze(this)}},n.exports=Application}),window.require.register("initialize",function(t,e){var n=e("application");$(function(){$("head").append('<script src="https://www.youtube.com/iframe_api"></script>'),n.initialize(),Backbone.history.start()})}),window.require.register("lib/router",function(t,e,n){var i=e("application");n.exports=Backbone.Router.extend({routes:{"":"home"},home:function(){$("body").html(i.homeView.render().el)}})}),window.require.register("lib/view_helper",function(){}),window.require.register("models/list",function(t,e,n){n.exports=Backbone.Collection.extend({initialize:function(){this.current=-1,this.on("add",function(){-1===this.current&&(this.current=0)}),this.on("remove",function(){this.isEmpty()}),this.on("reset",function(){this.isEmpty()})},isEmpty:function(){0===this.length&&(this.current=-1)},next:function(){var t=this.length;if(0===t)return-1;if(t>this.current+1)for(var e=this.current+1;t>=e;e++)if(this.at(e).get("inc")===!0)return this.current=e,e},prev:function(){var t=this.length;if(0===t)return-1;if(this.current-1>-1)for(var e=this.current-1;e>-1;e--)if(this.at(e).get("inc")===!0)return this.current=e,e},inc:function(t){var e=this.get(t);return e.get("inc")?e.set("inc",!1):e.set("inc",!0),e}})}),window.require.register("models/player",function(t,e,n){e("./list"),n.exports=Backbone.Model.extend({defaults:{width:200,height:200,state:-1},initialize:function(){var t=this;window.onYouTubeIframeAPIReady=function(){t.createPlayer()}},createPlayer:function(){var t=this;this.YTPlayer=new YT.Player("player",{height:this.get("height"),width:this.get("width"),events:{onStateChange:function(e){t.set("state",e.data),t.stateChanged(e)}}})},stateChanged:function(){console.log("STATECHANGED: "+this.get("state"));var t=this.get("state");switch(t){case 1:break;case 2:}0===t&&console.log("statechanged and is 0")},play:function(){switch(this.get("state")){case-1:console.log("unstarted"),this.load();break;case 0:console.log("ended"),this.YTPlayer.playVideo();break;case 1:console.log("playing"),this.YTPlayer.pauseVideo();break;case 2:console.log("paused"),this.YTPlayer.playVideo();break;case 3:break;case 5:this.YTPlayer.playVideo()}},load:function(){this.YTPlayer.cueVideoById(this.get("list").at(this.get("list").current).get("videoId"))},unload:function(){this.YTPlayer.stopVideo(),this.YTPlayer.clearVideo()},next:function(){this.get("state")!==void 0&&-1!==this.get("state")&&(this.list.next(),console.log(this.list),this.load())},prev:function(){this.get("state")!==void 0&&-1!==this.get("state")&&this.list.prev()},mute:function(){this.get("state")!==void 0&&-1!==this.get("state")&&(this.YTPlayer.isMuted()?this.YTPlayer.unMute():this.YTPlayer.mute())}})}),window.require.register("models/song",function(t,e,n){n.exports=Backbone.Model.extend({defaults:{favCount:0,viewCount:0,thumb:"",inc:!1}})}),window.require.register("views/control_view",function(t,e,n){var i=e("./templates/control");n.exports=Backbone.View.extend({el:$("#control"),template:i,events:{"click #playBtn":"play","click #prevBtn":"prev","click #loadBtn":"loadClicked","click #nextBtn":"next","click #muteBtn":"mute"},initialize:function(){this.render(),this.model.get("list").bind("reset",function(){})},render:function(){return this.$el.html(this.template),this},play:function(){this.model.play()},next:function(){this.model.next()},prev:function(){this.model.prev()}})}),window.require.register("views/display_view",function(t,e,n){var i=e("views/song_view"),r=e("./templates/display");n.exports=Backbone.View.extend({el:$("#display"),elm:"displayTable",template:r,initialize:function(){if(this.render(),this.collection!==void 0){var t=this;this.collection.bind("add",function(e){t.renderEach(e)}),this.collection.bind("remove",function(){t.render()}),this.collection.bind("reset",function(){t.render()})}},events:{"click #deleteAllBtn":"deleteAll","click #addAllBtn":"addAll"},render:function(){if(this.$el.html(this.template),this.collection!==void 0){var t=this;_.each(this.collection.models,function(e){t.renderEach(e)})}return this},renderEach:function(t){var e=new i({model:t});$("#"+this.elm).append(e.render().el)},deleteAll:function(){this.collection.reset()},addAll:function(){console.log("test")}})}),window.require.register("views/nav_view",function(t,e,n){var i=e("models/song"),r=e("./templates/nav");n.exports=Backbone.View.extend({el:$("#nav"),template:r,events:{"click #searchBtn":"getSongs","keypress input[type=text]":"onReturn","click #relevanceBtn":"setRelevance","click #viewCountBtn":"setViewCount","click #publishedBtn":"setPublished"},initialize:function(){this.render(),this.searchBy="viewCount"},render:function(){return this.$el.html(this.template),this},onReturn:function(t){13===t.keyCode&&this.getSongs()},getData:function(t){var e=this.buildUrl();$.getJSON(e,function(e){var n=e.feed.entry;t(n)})},buildUrl:function(t){var e="http://gdata.youtube.com/feeds/api/videos?alt=json";return e+="&q="+this.search,"viewCount"===this.searchBy?e+="&orderby=viewCount":"published"===this.searchBy&&(e+="&orderby=published"),t&&(e+="&start-index=25"),e},getSongs:function(){var t=this;this.search=_.escape($("#searchBox").val()),this.getData(function(e){for(var n=0;e.length>n;n++){var r=e[n],o=new i,s=/[a-zA-Z0-9\-\_]{11}/,a=r.link[0].href;o.set("videoId",a.match(s)[0]),o.set("title",r.title.$t),o.set("author",r.author[0].name.$t),o.set("date",r.published.$t),o.set("duration",r.media$group.yt$duration.seconds),r.yt$statistics===void 0?(o.set("viewCount",0),o.set("favCount",0)):(o.set("viewCount",r.yt$statistics.viewCount||0),o.set("favCount",r.yt$statistics.favoriteCount||0)),r.media$group.media$thumbnail[0].url!==void 0&&o.set("thumb",r.media$group.media$thumbnail[0].url),t.collection.add(o)}})},setRelevance:function(){this.searchBy="relevance",$("#searchByIcon").removeClass("icon-time").removeClass("icon-eye-open").addClass("icon-zoom-in")},setViewCount:function(){this.searchBy="viewCount",$("#searchByIcon").removeClass("icon-time").removeClass("icon-zoom-in").addClass("icon-eye-open")},setPublished:function(){this.searchBy="published",$("#searchByIcon").removeClass("icon-zoom-in").removeClass("icon-eye-open").addClass("icon-time")}})}),window.require.register("views/song_view",function(t,e,n){var i=e("./templates/song");n.exports=Backbone.View.extend({className:"song",template:i,initialize:function(){this.render()},render:function(){return this.$el.html(this.template(this.model.toJSON())),this},events:{"click #play":"play","click #add":"add"},play:function(){this.model.set("inc",!0)},add:function(){this.model.get("inc")?(this.$el.find("#add i").removeClass("icon-minus").addClass("icon-plus"),this.model.set("inc",!1)):(this.$el.find("#add i").removeClass("icon-plus").addClass("icon-minus"),this.model.set("inc",!0))}})}),window.require.register("views/templates/control",function(t,e,n){n.exports=Handlebars.template(function(t,e,n,i,r){return this.compilerInfo=[3,">= 1.0.0-rc.4"],n=n||t.helpers,r=r||{},'<div class="navbar navbar-fixed-bottom navbar-inverse">\n  	<div class="navbar-inner">\n		<ul class="nav">\n			<li><button id="prevBtn"><i class="icon-step-backward"></i></button></li>\n			<li><button id="playBtn"><i class="icon-play"></i></button></li>\n			<li><button id="nextBtn"><i class="icon-step-forward"></i></button></li>\n			<li><button id="muteBtn"><i class="icon-volume-off"></i></button></li>\n			<div id="player"></div> \n		</ul>\n	</div>\n</div>'})}),window.require.register("views/templates/display",function(t,e,n){n.exports=Handlebars.template(function(t,e,n,i,r){return this.compilerInfo=[3,">= 1.0.0-rc.4"],n=n||t.helpers,r=r||{},'<button id="addAllBtn"><i class="icon-plus"></i> Add All</button>\n<button id="deleteAllBtn"><i class="icon-trash"></i> Delete All</button>\n\n<table id="displayTable" class="table table-striped table-bordered">\n\n</table>'})}),window.require.register("views/templates/home",function(t,e,n){n.exports=Handlebars.template(function(t,e,n,i,r){return this.compilerInfo=[3,">= 1.0.0-rc.4"],n=n||t.helpers,r=r||{},'<header>\n	<div class="container">\n		<h1>Banana Pancakes</h1>\n	</div>\n</header>\n\n<div class="container">\n	\n	<p class="lead">Congratulations, your Brunch project is set up and very yummy. Thanks for using Banana Pancakes!</p>\n	\n	<div class="row">\n		\n		<div class="span4">\n			<h2>Banana Pancakes I</h2>\n			<p><a href="http://allrecipes.com/recipe/banana-pancakes-i/"><img src="http://i.imgur.com/YlAsp.jpg" /></a></p>\n			<blockquote>\n				<p>Crowd pleasing banana pancakes made from scratch. A fun twist on ordinary pancakes.</p>\n				<small><a href="http://allrecipes.com/cook/1871017/profile.aspx">ADDEAN1</a> from <cite title="allrecepies.com">allrecepies.com</cite></small>\n			</blockquote>\n			<p><a class="btn" href="http://allrecipes.com/recipe/banana-pancakes-i/">View Recipe &raquo;</a></p>\n		</div>\n		\n		<div class="span4">\n			<h2>Banana Brown Sugar Pancakes</h2>\n			<p><a href="http://allrecipes.com/recipe/banana-brown-sugar-pancakes"><img src="http://i.imgur.com/Yaq7Y.jpg" /></a></p>\n			<blockquote>\n				<p>This recipe I made because I wanted to use up some instant banana oatmeal I had. I don\'t use syrup on it because of the sweetness from the oatmeal and brown sugar.</p>\n				<small><a href="http://allrecipes.com/cook/10041806/profile.aspx">Nscoober2</a> from <cite title="allrecepies.com">allrecepies.com</cite></small>\n			</blockquote>\n			<p><a class="btn" href="http://allrecipes.com/recipe/banana-brown-sugar-pancakes">View Recipe &raquo;</a></p>\n		</div>\n		\n		<div class="span4">\n			<h2>Banana Pancakes II</h2>\n			<p><a href="http://allrecipes.com/recipe/banana-pancakes-ii/"><img src="http://i.imgur.com/dEh09.jpg" /></a></p>\n			<blockquote>\n				<p>These yummy pancakes are a snap to make.</p>\n				<small><a href="http://allrecipes.com/cook/18911/profile.aspx">sal</a> from <cite title="allrecepies.com">allrecepies.com</cite></small>\n			</blockquote>\n			<p><a class="btn" href="http://allrecipes.com/recipe/banana-pancakes-ii/">View Recipe &raquo;</a></p>\n		</div>\n		\n	</div>\n	\n</div>\n'})}),window.require.register("views/templates/nav",function(t,e,n){n.exports=Handlebars.template(function(t,e,n,i,r){return this.compilerInfo=[3,">= 1.0.0-rc.4"],n=n||t.helpers,r=r||{},'<div class="navbar navbar-fixed-top navbar-inverse">\n  <div class="navbar-inner">\n    <div class="container">\n      <a class="brand span2" href="#">Shuffi</a>\n      <ul class="nav">\n        <li>\n          \n      <div class="controls">\n        <div class="navbar-search input-append">\n          <input id="searchBox" class="search-query" type="text" placeholder=\'e.g. chillstep mix\' autofocus>\n\n          <div class="btn-group">\n            <button type="submit" class="btn btn-inverse"><i class="icon-search icon-white"></i></button>\n            <a class="btn btn-primary btn-inverse" href="#"><i id="searchByIcon" class="icon-eye-open icon-white"></i></a>\n            <a class="btn btn-primary btn-inverse dropdown-toggle" data-toggle="dropdown" href="#"><span class="caret icon-white"></span></a>\n            <ul class="dropdown-menu">\n              <li><span id="relevanceBtn" href=""><i class="icon-zoom-in"></i> Relevance</span></li>\n              <li><span id="viewCountBtn"><i class="icon-eye-open"></i> View Count</span></li>\n              <li><span id="publishedBtn"><i class="icon-time"></i> Published</span></li>\n            </ul>\n          </div>\n\n        </div>\n      </div>\n\n        </li>\n      </ul>\n  	</div>\n  </div>\n</div>\n'})}),window.require.register("views/templates/song",function(t,e,n){n.exports=Handlebars.template(function(t,e,n,i,r){this.compilerInfo=[3,">= 1.0.0-rc.4"],n=n||t.helpers,r=r||{};var o,s="",a="function",l=this.escapeExpression;return s+='<tr>\n<!-- 	<td><button id="inc" type="checkbox"></button></td>\n	<td><button id="play"><i class="icon-play"></button></td>\n -->	<td><button id="add"><i class="icon-plus"></i></button></td>\n	<td><img src="',(o=n.thumb)?o=o.call(e,{hash:{},data:r}):(o=e.thumb,o=typeof o===a?o.apply(e):o),s+=l(o)+'" alt="',(o=n.title)?o=o.call(e,{hash:{},data:r}):(o=e.title,o=typeof o===a?o.apply(e):o),s+=l(o)+'"></td>\n	<td>',(o=n.title)?o=o.call(e,{hash:{},data:r}):(o=e.title,o=typeof o===a?o.apply(e):o),s+=l(o)+"</td>\n	<td>",(o=n.author)?o=o.call(e,{hash:{},data:r}):(o=e.author,o=typeof o===a?o.apply(e):o),s+=l(o)+"</td>\n	<td>",(o=n.duration)?o=o.call(e,{hash:{},data:r}):(o=e.duration,o=typeof o===a?o.apply(e):o),s+=l(o)+"</td>\n	<td>",(o=n.viewCount)?o=o.call(e,{hash:{},data:r}):(o=e.viewCount,o=typeof o===a?o.apply(e):o),s+=l(o)+' <i class="icon-eye-open"></i></td>\n	<td>',(o=n.favCount)?o=o.call(e,{hash:{},data:r}):(o=e.favCount,o=typeof o===a?o.apply(e):o),s+=l(o)+' <i class="icon-heart"></i></td>\n</tr>'})});