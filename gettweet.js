const puppeteer = require('puppeteer');

const { config } = require('./config');
const args = process.argv.slice(2);
console.log(con)
let theurl = null;
if (args.find(v => v.includes('url='))) {
    theurl = args.find(v => v.includes('url=')).replace('url=', '');
}



function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

if (!theurl) {
    console.log('url= is required');
} else {
    (async() => {
        const browser = await puppeteer.launch()
        const page = await browser.newPage()

        await page.setViewport({
            width: 1280,
            height: 3000,
            deviceScaleFactor: 3
        });

        let r = null
        let uParts = theurl.split('/')
        let fname = uParts.pop();
        const theFile = `
<!doctype html>
<html>
<head>
<meta charset='UTF-8'>
</head>
<body>
    <blockquote class="twitter-tweet">
        <p lang="en" dir="ltr"></p>&mdash; <a href="${theurl}?ref_src=twsrc%5Etfw">March 8, 2021</a></blockquote>
    <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
</body>
</html>`;
        page.setContent(theFile);
        await page.waitForSelector('iframe#twitter-widget-0');
        await page.waitForTimeout(3000);

        await page.waitForSelector('iframe#twitter-widget-0');
        await page.waitForTimeout(3000);
        const tweet = await page.$('div.twitter-tweet-rendered');
        const bounding_box = await tweet.boundingBox();
        await tweet.screenshot({
            path: `${config.imgDir}${fname}.png`,
            clip: {
                x: bounding_box.x,
                y: bounding_box.y,
                width: Math.min(bounding_box.width, page.viewport().width),
                height: Math.min(bounding_box.height, page.viewport().height),
            },
        });
        r = await page.goto(theurl, { timeout: 20000, waitUntil: 'networkidle0' }).catch(e => console.error(e));

        let alttext = await page.title();
        const outputString = `

<a href="${theurl}" target="_blank" rel="noopener"><img src="${config.imgURL}${fname}.png" loading="lazy" class="${config.classNames}" width="${bounding_box.width}" height="${bounding_box.height}" alt="${htmlEntities(alttext)}"/></a>

`
        console.log(outputString)
        browser.close();
    })();
}