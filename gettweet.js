const puppeteer = require('puppeteer');
const imagemin = require('imagemin');
const imageminWebp = require('imagemin-webp');
const imageminPngquant = require('imagemin-pngquant');
const fs = require('fs');
const { config } = require('./config');
const args = process.argv.slice(2);
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
            deviceScaleFactor: 2
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
<body style="background-color: ${config.background}">
    <blockquote class="twitter-tweet">
        <p lang="en" dir="ltr"></p>&mdash; <a href="${theurl}?ref_src=twsrc%5Etfw"></a></blockquote>
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
            path: `${config.imgDir}unopt/${fname}.png`,
            clip: {
                x: bounding_box.x,
                y: bounding_box.y,
                width: Math.min(bounding_box.width, page.viewport().width),
                height: Math.min(bounding_box.height, page.viewport().height),
            },
        });
        (async() => {
            const files = await imagemin([`${config.imgDir}/unopt/*.png`], {
                destination: `${config.imgDir}`,
                plugins: [
                    imageminPngquant({
                        quality: [0.6, 0.8]
                    })
                ]
            });
        })();
        (async() => {
            const files = await imagemin([`${config.imgDir}/unopt/*.png`], {
                destination: `${config.imgDir}`,
                plugins: [
                    imageminWebp({ quality: 50 })
                ]
            });
            fs.unlinkSync(`${config.imgDir}unopt/${fname}.png`);
        })();


        if (config.outputHtml) {
            r = await page.goto(theurl, { timeout: 20000, waitUntil: 'networkidle0' }).catch(e => console.error(e));

            let alttext = await page.title();
            let lazyload = '';
            if (config.lazyload) {
                lazyload = `loading="lazy" `;
            }
            const outputString = `
            
            <a href="${theurl}" target="_blank" rel="noopener">
            <picture>
                <source type="image/webp" srcset="${config.imgURL}${fname}.webp">
                <img src="${config.imgURL}${fname}.png" ${lazyload}class="${config.classNames}" width="${bounding_box.width}" height="${bounding_box.height}" alt="${htmlEntities(alttext)}"/>
            </picture>
            </a>

`
            console.log(outputString);
        } else {
            console.log(`done`);
        }
        browser.close();
    })();
}