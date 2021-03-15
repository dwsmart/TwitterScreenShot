# TwitterScreenShot
A Node CLI tool to make a screenshot of a tweet and create a link

## Install
Download the files from git (clone or download the zip)
run `npm install`
amend config.js to suit

## config
All configuration is done in the config.js file.

 * `imgDir` _default `tweetimg/`_ - The directory the screenshot of the tweet will be generated in, the filename will always be `{tweet_id}.png` 
 * `outputHtml` _default `true`_ - Allowed values are `true` and `false`. If true, the script will return html with a `<a>` link and `<img>` tag
 * `imgURL` _default `http://example.com/tweetimg/`_ - The url to prepend to the `src` attribute in the `<img>` tag
 * `classNames` _default `''`_ - a string of class names to add to the `class` attribute of the `<img>` tag
 * `lazyload` _default `true`_ - Allowed values are `true` and `false`. If true, the script will add `lazyload="true"` to the `<img>` tag

## Usage
`node gettweet url={tweet_url here}`

### example:
`node gettweet url=https://twitter.com/davewsmart/status/1364211090968707072`
#### output
 ```html
<a href="https://twitter.com/davewsmart/status/1364211090968707072" target="_blank" rel="noopener"><img src="http://example.com/tweetimg/1364211090968707072.png" loading="lazy" class="" width="550" height="380" alt="Dave Smart on Twitter: &quot;'tiz me! Talking! At #brightonSEO! I'm giddy as a kipper! Sign up from the grand total of free at the link!&quot; / Twitter"/></a>
```