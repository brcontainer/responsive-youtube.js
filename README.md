# Responsive-youtube.js

Simple script for use Youtube Iframe API in responsive web sites

## Requirements

- IE9+
- Safari6+
- Google Chrome
- Firefox
- MutationObserver

> Note¹: Use `if (ResponsiveYoutube.supported)`
>
> Note²: Youtube API requires `Object.create` function (IE9+ and Safari5+)

## HTML usage

```html
<!-- embed video in page -->
<div data-ry-video="TALH8SsQJp4"></div>

<!-- embed video in page without "responsive" -->
<div data-ry-video="5ABos9UTfJU" data-ry-ignore="true"></div>

<script src="responsive-youtube.js"></script>
<script>
ResponsiveYoutube.start();
</script>
```

## Properties and functions

Name | description
--- | ---
`ResponsiveYoutube.supported` | Create players
`ResponsiveYoutube.start([setup])` | Create players
`ResponsiveYoutube.on(type, function)` | Add global event
`ResponsiveYoutube.off(type, function)` | Remove global event
`ResponsiveYoutube.destroy()` | Destroy all players (use with Angular pagination, Ajax pagination, and Pjax)

## Events

Name | equivalent to | callback format
--- | --- | ---
`done` | `onYouTubeIframeAPIReady` | `function () {...}`
`create` | - | `function (player) {...}`
`read` | `onReady` | `function (event, player) {...}`
`state` | `onStateChange` | `function (event, player) {...}`
`quality` | `onPlaybackQualityChange` | `function (event, player) {...}`
`rate` | `onPlaybackRateChange` | `function (event, player) {...}`
`error` | `onError` | `function (event, player) {...}`
`api` | `onApiChange` | `function (event, player) {...}`

More details in: https://developers.google.com/youtube/iframe_api_reference#Events

Example usage:

```javascript
ResponsiveYoutube.start();

ResponsiveYoutube.on("done", function () {
    //API done...
});

ResponsiveYoutube.on("create", function (player) {
    //Something...
});

ResponsiveYoutube.on("state", function (event, player) {
    //Something...
});
```

## Properties

Property | html5 | description
--- | --- | ---
`autoplay` | `data-ry-autoplay` | This parameter specifies whether the initial video will automatically start to play when the player loads. Supported values are 0 or 1. The default value is 0.
`cc_load_policy` | `data-ry-cc_load_policy` | Setting the parameter's value to 1 causes closed captions to be shown by default, even if the user has turned captions off. The default behavior is based on user preference.
`color` | `data-ry-color` | This parameter specifies the color that will be used in the player's video progress bar to highlight the amount of the video that the viewer has already seen.
`controls` | `data-ry-controls` | This parameter indicates whether the video player controls are displayed
`disablekb` | `data-ry-disablekb` | Setting the parameter's value to 1 causes the player to not respond to keyboard controls.
`fs` | `data-ry-fs` | Setting this parameter to 0 prevents the fullscreen button from displaying in the player. The default value is 1, which causes the fullscreen button to display.
`hl` | `data-ry-hl` | Sets the player's interface language.
`iv_load_policy` | `data-ry-iv_load_policy` | Setting the parameter's value to 1 causes video annotations to be shown by default, whereas setting to 3 causes video annotations to not be shown by default. The default value is 1.
`list` | `data-ry-list` | The list parameter, in conjunction with the listType parameter, identifies the content that will load in the player.
`listType` | `data-ry-listType` | The listType parameter, in conjunction with the list parameter, identifies the content that will load in the player. Valid parameter values are playlist, search, and `user_uploads`.
`loop` | `data-ry-loop` | In the case of a single video player, a setting of 1 causes the player to play the initial video again and again.
`modestbranding` | `data-ry-modestbranding` | This parameter lets you use a YouTube player that does not show a YouTube logo. Set the parameter value to 1 to prevent the YouTube logo from displaying in the control bar. Note that a small YouTube text label will still display in the upper-right corner of a paused video when the user's mouse pointer hovers over the player.
`playlist` | `data-ry-playlist` | This parameter specifies a comma-separated list of video IDs to play. If you specify a value, the first video that plays will be the VIDEO_ID specified in the URL path, and the videos specified in the playlist parameter will play thereafter.
`playsinline` | `data-ry-playsinline` | This parameter controls whether videos play inline or fullscreen in an HTML5 player on iOS.
`rel` | `data-ry-rel` | This parameter indicates whether the player should show related videos when playback of the initial video ends. Supported values are 0 and 1. The default value is 1.
`showinfo` | `data-ry-showinfo` | Supported values are 0 and 1.
`start` | `data-ry-start` | This parameter causes the player to begin playing the video at the given number of seconds from the start of the video.
`widget_referrer` | `data-ry-widget_referrer` | This parameter identifies the URL where the player is embedded.

More parameters and details in: https://developers.google.com/youtube/player_parameters?playerVersion=HTML5#Parameters

Set default properties in `.start()`:

```javascript
ResponsiveYoutube.start({
    rel: 0 //Remove related videos
});
```

Usage in html:

```html
<!-- autoplay -->
<div data-ry-video="eZh0R6uB5Zc" data-ry-autoplay="1"></div>

<!-- remove related -->
<div data-ry-video="eZh0R6uB5Zc" data-ry-rel="1"></div>

<!-- without controls with closed caption -->
<div data-ry-video="eZh0R6uB5Zc" data-ry-controls="0" data-ry-cc_load_policy="1"></div>
```

---

## TODO

- [x] destroy players
- [ ] Create cover alternative to video
