# TwitterScreenShot
A Node CLI tool to make a screenshot of a tweet and create a link. A twitter embed can add extra weight in JavaScript in a page, this allows you to create a static image of a tweet from its URL, and a link to it, which is much lighter.

The script creates a .png and a .webp of the image, and returns the html for them in an `<picture>` tag.

There are downsides though, with this being a static image, the number of likes and retweets are not updated (unless you ran the script again!), and commenting / retweet links are not interactive.

## Install
Download the files from git, you can clone them, [see guide](https://docs.github.com/en/github/creating-cloning-and-archiving-repositories/cloning-a-repository) or download the zip file (click the green code button and click Download Zip)

run `npm install`

copy `config.js.default` to `config.js` and amend to suit

Whatever folder you specify for `imgDir` needs to exist, and also needs contain a further folder called named `unopt`:

```
tweetimg/
|__unopt/
```

## config
All configuration is done in the `config.js` file.

 * `imgDir` _default `tweetimg/`_ - The directory the screenshot of the tweet will be generated in, the filenames will always be `{tweet_id}.png` & `{tweet_id}.webp`
 * `background` _default `#ffffff`_ - Background colour of the tweet snapshot.
 * `outputHtml` _default `true`_ - Allowed values are `true` and `false`. If true, the script will return html with a `<a>` link and `<picture> <img>` tag
 * `imgURL` _default `http://example.com/tweetimg/`_ - The url to prepend to the `src` attribute in the `<img>` tag
 * `classNames` _default `''`_ - a string of class names to add to the `class` attribute of the `<img>` tag
 * `lazyload` _default `true`_ - Allowed values are `true` and `false`. If true, the script will add `lazyload="true"` to the `<img>` tag

## Usage
`node gettweet url={tweet_url here}`

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