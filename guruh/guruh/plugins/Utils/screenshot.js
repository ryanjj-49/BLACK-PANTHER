import { sendInteractive } from '../../lib/sendInteractive.js';
export default async (context) => {

const { client, m, text, botname } = context;
await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });



try {
let cap = `╭━⬣ 「 SCREENSHOT 』── ⚝
┃ Screenshot by ${botname}\n╰━━━━━━━━━━━━━━━\n`

if (!text) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
    return sendInteractive(client, m, "┃ Provide a website link to screenshot, moron.\n╰━━━━━━━━━━━━━━━\n")
}

const image = `https://image.thum.io/get/fullpage/${text}`

await client.sendMessage(m.chat, { image: { url: image }, caption: cap});


} catch (error) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});

sendInteractive(client, m, "┃ Screenshot failed. Probably your garbage link.\n╰━━━━━━━━━━━━━━━\n")

}

}
