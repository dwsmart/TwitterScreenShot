# TwitterScreenShot
A Node CLI tool to make a screenshot of a tweet and create a link

## Install
Download the files from git (clone or download the zip)
run `npm install`
amend config.js to suit

## Usage
`node gettweet url={tweet_url here}`

### example:
`node gettweet url=https://twitter.com/davewsmart/status/1364211090968707072`
 ### output
 ```
<a href="https://twitter.com/davewsmart/status/1364211090968707072" target="_blank" rel="noopener"><img src="http://example.com/tweetimg/1364211090968707072.png" loading="lazy" class="" width="550" height="380" alt="Dave Smart on Twitter: &quot;'tiz me! Talking! At #brightonSEO! I'm giddy as a kipper! Sign up from the grand total of free at the link!&quot; / Twitter"/></a>
```