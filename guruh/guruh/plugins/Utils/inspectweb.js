import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import { sendInteractive } from '../../lib/sendInteractive.js';

export default async (context) => {
    const { m, text } = context;
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

    if (!text) {
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
        return sendInteractive(client, m, "┃ Provide a valid web link to inspect, dimwit.\n┃ Bot will crawl HTML, CSS, JS, and media.\n╰━━━━━━━━━━━━━━━\n");
    }

    if (!/^https?:\/\//i.test(text)) {
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
        return sendInteractive(client, m, "┃ URL must start with http:// or https://, genius.\n╰━━━━━━━━━━━━━━━\n");
    }

    try {
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
        const response = await fetch(text);
        const html = await response.text();
        const $ = cheerio.load(html);

        const mediaFiles = [];
        $('img[src], video[src], audio[src]').each((i, element) => {
            let src = $(element).attr('src');
            if (src) {
                mediaFiles.push(src);
            }
        });

        const cssFiles = [];
        $('link[rel="stylesheet"]').each((i, element) => {
            let href = $(element).attr('href');
            if (href) {
                cssFiles.push(href);
            }
        });

        const jsFiles = [];
        $('script[src]').each((i, element) => {
            let src = $(element).attr('src');
            if (src) {
                jsFiles.push(src);
            }
        });

        await sendInteractive(client, m, `╭━⬣ 「 HTML CONTENT 』── ⚝
${html}\n╰━━━━━━━━━━━━━━━\n`);

        if (cssFiles.length > 0) {
            for (const cssFile of cssFiles) {
                const cssResponse = await fetch(new URL(cssFile, text));
                const cssContent = await cssResponse.text();
                await sendInteractive(client, m, `╭━⬣ 「 CSS FILE 』── ⚝
${cssContent}\n╰━━━━━━━━━━━━━━━\n`);
            }
        } else {
            await sendInteractive(client, m, "┃ No external CSS files found.\n╰━━━━━━━━━━━━━━━\n");
        }

        if (jsFiles.length > 0) {
            for (const jsFile of jsFiles) {
                const jsResponse = await fetch(new URL(jsFile, text));
                const jsContent = await jsResponse.text();
                await sendInteractive(client, m, `╭━⬣ 「 JS FILE 』── ⚝
${jsContent}\n╰━━━━━━━━━━━━━━━\n`);
            }
        } else {
            await sendInteractive(client, m, "┃ No external JavaScript files found.\n╰━━━━━━━━━━━━━━━\n");
        }

        if (mediaFiles.length > 0) {
            await sendInteractive(client, m, `╭━⬣ 「 MEDIA FILES 』── ⚝
${mediaFiles.map(f => `┃ ${f}`).join('\n')}\n╰━━━━━━━━━━━━━━━\n`);
        } else {
            await sendInteractive(client, m, "┃ No media files found. Empty site, empty soul.\n╰━━━━━━━━━━━━━━━\n");
        }

    } catch (error) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
        console.error(error);
        return sendInteractive(client, m, "┃ Error fetching website content. Site's probably trash.\n╰━━━━━━━━━━━━━━━\n");
    }
};
