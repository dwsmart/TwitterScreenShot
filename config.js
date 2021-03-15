const config = {
    imgDir: "tweetimg/", //where the tweet snapshot is saved
    background: "#000000", //page background colour for the snapshot
    outputHtml: true, // output a <a><img> string that links to the tweet and creates the html for the img, including height, width & alt tags
    imgURL: "http://example.com/tweetimg/", // the URL directory (used in the <img> src),
    classNames: "", // add classes to the outputted <img> html
    lazyload: true, // add loading="lazy" to the outputted <img>
}

module.exports = { config }