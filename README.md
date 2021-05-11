# TwitterScreenShot
A Node CLI tool to make a screenshot of a tweet and create a link. A twitter embed can add extra weight in JavaScript in a page, this allows you to create a static image of a tweet from its URL, and a link to it, which is much lighter.

The script creates a .png and a .webp of the image, and returns the html for them in an `<picture>` tag.

There are downsides though, with this being a static image, the number of likes and retweets are not updated (unless you ran the script again!), and commenting / retweet links are not interactive.

## Install

Download the files from git, you can clone them, [see guide](https://docs.github.com/en/github/creating-cloning-and-archiving-repositories/cloning-a-repository) or download the zip file (click the green code button and click Download Zip), or just click on the latest release and download the files.

run `npm install`

copy `config.js.default` to `config.js` and amend to suit

Whatever folder you specify for `imgDir` needs to exist, and also needs contain a further folder called named `unopt`:

```
tweetimg/
|__unopt/
```

## config
All configuration is done in the `config.js` file.

 * `imgDir` _default `tweetimg/`_ - The directory the screenshot of the tweet will be generated in, the filenames will always be `{tweet_id}.png` & `{tweet_id}.webp`.
 * `lightDark` _default `light`_ - Set to `dark` to create snapshot in twitter's dark mode.
 * `background` _default `#ffffff`_ - Background colour of the tweet snapshot.
 * `outputHtml` _default `true`_ - Allowed values are `true` and `false`. If true, the script will return html with a `<a>` link and `<picture> <img>` tag.
 * `imgURL` _default `http://example.com/tweetimg/`_ - The url to prepend to the `src` attribute in the `<img>` tag.
 * `classNames` _default `''`_ - a string of class names to add to the `class` attribute of the `<img>` tag.
 * `lazyload` _default `true`_ - Allowed values are `true` and `false`. If true, the script will add `lazyload="true"` to the `<img>` tag.

## Usage
`node gettweet url={tweet_url here} bg={valid color} --dark|--light --nothread`

* `url` - _Required_ - The url of the tweet, copy this from the browser bar
* `bg` - _Optional_ - override the page background colour set in `./config.js`.
* `--dark` - _Optional_ - force dark mode, overrides the setting in `./config.js`.
* `--light` - _Optional_ - force light mode, overrides the setting in `./config.js`.
* `--nothread` - _Optional_ - show just the individual tweet, not the conversation.


### example:
`node gettweet url=https://twitter.com/davewsmart/status/1364211090968707072`
#### output
 ```html
<a href="https://twitter.com/davewsmart/status/1364211090968707072" target="_blank" rel="noopener">
    <picture>
        <source type="image/webp" srcset="https://example.com/tweetimg/1364211090968707072.webp">
        <img src="https://example.com/tweetimg/1364211090968707072.png" loading="lazy" class="" width="550" height="380" alt="Dave Smart on Twitter: &quot;'tiz me! Talking! At #brightonSEO! I'm giddy as a kipper! Sign up from the grand total of free at the link!&quot; / Twitter"/>
    </picture>
</a>
```

## Some Great Alternatives
Use Hugo as a CMS? [John Muller](https://johnmu.com/tweet-screenshot-embeds/) has an excellent integrated solution [static-social-posts on github](https://github.com/softplus/static-social-posts)

Perhaps prefer an SVG? Try Terence Eden's ([@edent](https://twitter.com/edent)) [Tweet2SVG on gitlab](https://gitlab.com/edent/tweet2svg), a php driven solution.