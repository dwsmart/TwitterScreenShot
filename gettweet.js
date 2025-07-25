import puppeteer from 'puppeteer';
import imagemin from 'imagemin';
import imageminWebp from 'imagemin-webp';
import imageminPngquant from 'imagemin-pngquant';
import fs from 'fs';
import config from './config.js';

const imgDir = config.imgDir || 'tweetimg/';
const outputHtml = config.outputHtml || true;
let lightDark = config.lightDark || '';
let background = config.background || '#ffffff';
const imgURL = config.imgURL || 'https://example.com/tweetimg/';
const classNames = config.classNames || '';
const lazyload = config.lazyload || true;
let hideThread = '';
let theurl = null;
let mode = '';

const args = process.argv.slice(2);

if (lightDark.toLowerCase() === 'dark') {
    mode = ' data-theme="dark"';
}

if (args.find(v => v.includes('url='))) {
    theurl = args.find(v => v.includes('url=')).replace('url=', '');
}
if (args.find(v => v.includes('bg='))) {
    background = args.find(v => v.includes('bg=')).replace('bg=', '');
}
if (args.find(v => v.includes('--dark'))) {
    mode = ' data-theme="dark"';
}
if (args.find(v => v.includes('--light'))) {
    mode = '';
}
if (args.find(v => v.includes('--nothread'))) {
    hideThread = ' data-conversation="none"';
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
            deviceScaleFactor: 1
        });

        let r = null;
        let uParts = theurl.split('/');
        let fname = uParts.pop();
        const theFile = `
<!doctype html>
<html>
<head>
<meta charset='UTF-8'>
<style>
#twitter-widget-0 { 
    width: 100% !important; 
    height: 1000rem !important;
  }
  </style>
</head>
<body style="background-color: ${background}">
    <blockquote class="twitter-tweet"${mode}${hideThread}>
        <p lang="en" dir="ltr"></p>&mdash; <a href="${theurl}?ref_src=twsrc%5Etfw"></a></blockquote>
    <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
</body>
</html>`;
        page.setContent(theFile);

        await page.waitForSelector('iframe#twitter-widget-0');
        await new Promise(r => setTimeout(r, 5000));
        const tweetframe = await page.$('iframe#twitter-widget-0');
        const frame = await tweetframe.contentFrame();
        const tweet = await frame.$('div#app');
        const bounding_box = await tweet.boundingBox();
        await tweet.screenshot({
            path: `${imgDir}unopt/${fname}.png`,
            clip: {
                x: bounding_box.x - 20,
                y: bounding_box.y - 20,
                width: Math.min(bounding_box.width, page.viewport().width) + 20,
                height: Math.min(bounding_box.height, page.viewport().height) + 20,
            },
        });
        (async() => {
            const files = await imagemin([`${imgDir}/unopt/*.png`], {
                destination: `${imgDir}`,
                plugins: [
                    imageminPngquant({
                        quality: [0.6, 0.8]
                    })
                ]
            });
        })();
        (async() => {
            const files = await imagemin([`${imgDir}/unopt/*.png`], {
                destination: `${imgDir}`,
                plugins: [
                    imageminWebp({ quality: 50 })
                ]
            });
            fs.unlinkSync(`${imgDir}unopt/${fname}.png`);
        })();


        if (outputHtml) {
            r = await page.goto(theurl, { timeout: 20000, waitUntil: 'networkidle0' }).catch(e => console.error(e));

            let alttext = await page.title();
            let lazyloadString = '';
            if (lazyload) {
                lazyloadString = `loading="lazy" `;
            }
            const outputString = `
            
            <a href="${theurl}" target="_blank" rel="noopener">
            <picture>
                <source type="image/webp" srcset="${imgURL}${fname}.webp">
                <img src="${imgURL}${fname}.png" ${lazyloadString}class="${classNames}" width="${bounding_box.width}" height="${bounding_box.height}" alt="${htmlEntities(alttext)}"/>
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