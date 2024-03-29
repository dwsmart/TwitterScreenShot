import puppeteer from 'puppeteer';
import fetch from 'node-fetch';
import imagemin from 'imagemin';
import imageminWebp from 'imagemin-webp';
import imageminPngquant from 'imagemin-pngquant';
import { stripHtml } from "string-strip-html";
import fs from 'fs';
import config from './config.js';

const imgDir = config.imgDir || 'tweetimg/';
const outputHtml = config.outputHtml || true;
let background = config.background || '#ffffff';
const imgURL = config.imgURL || 'https://example.com/tweetimg/';
const classNames = config.classNames || '';
const lazyload = config.lazyload || true;
const isRounded = config.rounded || false;
let rounded = '';
if (isRounded) {
    rounded = ' mastodon-rounded';
}

let theurl = null;


const args = process.argv.slice(2);




if (args.find(v => v.includes('url='))) {
    theurl = args.find(v => v.includes('url=')).replace('url=', '');
}
if (args.find(v => v.includes('bg='))) {
    background = args.find(v => v.includes('bg=')).replace('bg=', '');
}
if (args.find(v => v.includes('--rounded'))) {
    rounded = ' mastodon-rounded';
}
if (args.find(v => v.includes('--square'))) {
    rounded = '';
}
if (!theurl) {
    console.log('url= is required');
} else {
    (async () => {
        const browser = await puppeteer.launch({headless: 'new'})
        const page = await browser.newPage()

        await page.setViewport({
            width: 1280,
            height: 3000,
            deviceScaleFactor: 1
        });

        let r = null;
        let uParts = theurl.split('/');
        let finalURL = theurl;
        let server = `${uParts[0]}//${uParts[2]}`;
        if ((uParts[4].match(/@/g) || []).length > 1) {
            server = `${uParts[0]}//${uParts[4].split('@')[2]}`;
            finalURL = `${server}/web/@${uParts[4].split('@')[1]}/${uParts[5]}`;
        }
        const id = uParts.pop();
        const fname = server.replace('https://', '').replace(/\./g, '_') + '_' + id;
        const theFile = `
<!doctype html>
<html>
<head>
<meta charset='UTF-8'>
<style>
.mastodon-rounded {
    border-radius: 15px;
}
</style>
</head>
<body style="background-color: ${background}">
    <iframe src="${finalURL.replace('web/', '')}/embed" class="mastodon-embed${rounded}" style="max-width: 100%; border: 0" width="400" allowfullscreen="allowfullscreen"></iframe>
    <script src="${server}/embed.js" async="async"></script>
    </body>
</html>`;
        page.setContent(theFile);
        await page.waitForSelector('iframe.mastodon-embed');
        await new Promise(r => setTimeout(r, 5000));
        const tootframe = await page.$('iframe.mastodon-embed');
        const frame = await tootframe.contentFrame();

        await frame.waitForSelector('div.activity-stream');
        await new Promise(r => setTimeout(r, 2000));
        const toot = await frame.$('div.activity-stream');
        const bounding_box = await toot.boundingBox();
        await toot.screenshot({
            path: `${imgDir}unopt/${fname}.png`,
            clip: {
                x: bounding_box.x,
                y: bounding_box.y,
                width: Math.min(bounding_box.width, page.viewport().width),
                height: Math.min(bounding_box.height, page.viewport().height),
            },
        });
        (async () => {
            const files = await imagemin([`${imgDir}/unopt/*.png`], {
                destination: `${imgDir}`,
                plugins: [
                    imageminPngquant({
                        quality: [0.6, 0.8]
                    })
                ]
            });
        })();
        (async () => {
            const files = await imagemin([`${imgDir}/unopt/*.png`], {
                destination: `${imgDir}`,
                plugins: [
                    imageminWebp({ quality: 50 })
                ]
            });
            fs.unlinkSync(`${imgDir}unopt/${fname}.png`);
        })();


        if (outputHtml) {
            const apiResponse = await fetch(`${server}/api/v1/statuses/${id}`).then(response => response.json());
            let alttext = stripHtml(apiResponse.content).result;
            let lazyloadString = '';
            if (lazyload) {
                lazyloadString = `loading="lazy" `;
            }
            const outputString = `
            
            <a href="${theurl}" target="_blank" rel="noopener">
            <picture>
                <source type="image/webp" srcset="${imgURL}${fname}.webp">
                <img src="${imgURL}${fname}.png" ${lazyloadString}class="${classNames}" width="${bounding_box.width}" height="${bounding_box.height}" alt="${alttext}"/>
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