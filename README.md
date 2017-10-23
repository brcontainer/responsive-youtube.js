# Responsive-youtube.js

Simple script for use Youtube Iframe API in responsive web sites

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

## Events

Name | equivalent to
--- | ---
`done` | `onYouTubeIframeAPIReady`
`create` | -
`read` | `onReady`
`state` | `onStateChange`
`quality` | `onPlaybackQualityChange`
`rate` | `onPlaybackRateChange`
`error` | `onError`
`api` | `onApiChange`

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

Property | description
--- | ---
`autoplay` | This parameter specifies whether the initial video will automatically start to play when the player loads. Supported values are 0 or 1. The default value is 0.
`cc_load_policy` | Setting the parameter's value to 1 causes closed captions to be shown by default, even if the user has turned captions off. The default behavior is based on user preference.
`color` | This parameter specifies the color that will be used in the player's video progress bar to highlight the amount of the video that the viewer has already seen.
`controls` | This parameter indicates whether the video player controls are displayed
`disablekb` | Setting the parameter's value to 1 causes the player to not respond to keyboard controls.
`fs` | Setting this parameter to 0 prevents the fullscreen button from displaying in the player. The default value is 1, which causes the fullscreen button to display.
`hl` | Sets the player's interface language.
`iv_load_policy` | Setting the parameter's value to 1 causes video annotations to be shown by default, whereas setting to 3 causes video annotations to not be shown by default. The default value is 1.
`list` | The list parameter, in conjunction with the listType parameter, identifies the content that will load in the player.
`listType` | The listType parameter, in conjunction with the list parameter, identifies the content that will load in the player. Valid parameter values are playlist, search, and `user_uploads`.
`loop` | In the case of a single video player, a setting of 1 causes the player to play the initial video again and again.
`modestbranding` | This parameter lets you use a YouTube player that does not show a YouTube logo. Set the parameter value to 1 to prevent the YouTube logo from displaying in the control bar. Note that a small YouTube text label will still display in the upper-right corner of a paused video when the user's mouse pointer hovers over the player.
`playlist` | This parameter specifies a comma-separated list of video IDs to play. If you specify a value, the first video that plays will be the VIDEO_ID specified in the URL path, and the videos specified in the playlist parameter will play thereafter.
`playsinline` | This parameter controls whether videos play inline or fullscreen in an HTML5 player on iOS.
`rel` | This parameter indicates whether the player should show related videos when playback of the initial video ends. Supported values are 0 and 1. The default value is 1.
`showinfo` | Supported values are 0 and 1.
`start` | This parameter causes the player to begin playing the video at the given number of seconds from the start of the video.
`widget_referrer` | This parameter identifies the URL where the player is embedded.

More parameters and details in: https://developers.google.com/youtube/player_parameters?playerVersion=HTML5#Parameters

Usage in `.start()`:

```javascript
ResponsiveYoutube.start({
    rel: 0 //Remove related videos
});
```

Usage in html:

```html
<!-- autoplay -->
<div data-ry-video="eZh0R6uB5Zc" data-ry-config="{&quot;autoplay&quot;:1}"></div>

<!-- remove related -->
<div data-ry-video="eZh0R6uB5Zc" data-ry-config="{&quot;rel&quot;:1}"></div>

<!-- without controls with closed caption -->
<div data-ry-video="eZh0R6uB5Zc" data-ry-config="{&quot;controls&quot;:0,&quot;cc_load_policy&quot;:1}"></div>
```
