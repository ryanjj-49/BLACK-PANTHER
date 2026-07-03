import axios from 'axios';
import { sendInteractive } from '../../lib/sendInteractive.js';
  import { uploadTempUrl } from '../../lib/toUrl.js';
  export default {
    name: 'tomp4',
    aliases: ['tovideo', 'stickertomp4', 'sticker2video'],
    description: 'Converts stickers to MP4 videos',
    run: async (context) => {
        const { client, m, mime } = context;
        try {
            await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
            if (!m.quoted) {
                await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
                return sendInteractive(client, m, `✦ ──『 TO VIDEO 』── ⚝
▢ The command requires a STICKER.\n▢ Your empty reply suggests you\n▢ cannot read.\n└──✪ 𝐁𝐋𝐀𝐂𝐊 𝐏𝐀𝐍𝐓𝐇𝐄𝐑 ┃ ᴹᴰ ✪──`);
            }
            const quotedMime = m.quoted.mimetype || '';
            if (!/webp/.test(quotedMime)) return sendInteractive(client, m, `✦ ──『 TO VIDEO 』── ⚝
▢ That is a file, not a sticker.\n▢ The .webp extension is a clue\n▢ you seem to have missed.\n└──✪ 𝐁𝐋𝐀𝐂𝐊 𝐏𝐀𝐍𝐓𝐇𝐄𝐑 ┃ ᴹᴰ ✪──`);
            const statusMsg = await sendInteractive(client, m, `✦ ──『 TO VIDEO 』── ⚝
▢ Forcing your static sticker into\n▢ a video. A pointless endeavor.\n└──✪ 𝐁𝐋𝐀𝐂𝐊 𝐏𝐀𝐍𝐓𝐇𝐄𝐑 ┃ ᴹᴰ ✪──`);
            const stickerBuffer = await m.quoted.download();
            if (!stickerBuffer) {
                await client.sendMessage(m.chat, { delete: statusMsg.key });
                await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
                return sendInteractive(client, m, `✦ ──『 FAILED 』── ⚝
▢ Failed to download. Your sticker is\n▢ as inaccessible as common sense.\n└──✪ 𝐁𝐋𝐀𝐂𝐊 𝐏𝐀𝐍𝐓𝐇𝐄𝐑 ┃ ᴹᴰ ✪──`);
            }
            const stickerUrl = await uploadTempUrl(stickerBuffer, 'webp');
            const encodedUrl = encodeURIComponent(stickerUrl);
            const convertApiUrl = `https://api.elrayyxml.web.id/api/maker/convert?url=${encodedUrl}&format=MP4`;
            const response = await axios.get(convertApiUrl, { headers: { 'accept': 'application/json', 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }, timeout: 30000 });
            if (!response.data.status || !response.data.result) throw new Error('The converter deemed your sticker unworthy.');
            const videoUrl = response.data.result;
            const videoResponse = await axios.get(videoUrl, { responseType: 'arraybuffer', timeout: 20000 });
            const videoBuffer = Buffer.from(videoResponse.data);
            await client.sendMessage(m.chat, { delete: statusMsg.key });
            await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
            await client.sendMessage(m.chat, { video: videoBuffer, caption: `✦ ──『 TO VIDEO 』── ⚝
▢ Behold, your motionless "video".\n└──✪ 𝐁𝐋𝐀𝐂𝐊 𝐏𝐀𝐍𝐓𝐇𝐄𝐑 ┃ ᴹᴰ ✪──` });
            await client.sendMessage(m.chat, { document: videoBuffer, mimetype: 'video/mp4', fileName: `sticker_${Date.now()}.mp4`, caption: `✦ ──『 MP4 FILE 』── ⚝
▢ Document version. Marginally\n▢ more useful.\n└──✪ 𝐁𝐋𝐀𝐂𝐊 𝐏𝐀𝐍𝐓𝐇𝐄𝐑 ┃ ᴹᴰ ✪──` });
        } catch (err) {
            console.error('ToMP4 error:', err);
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
            let userMessage = 'The conversion failed utterly. What did you expect?';
            if (err.message.includes('timeout')) userMessage = 'The process timed out. Your sticker is likely more complex than your thoughts.';
            if (err.message.includes('Network Error')) userMessage = 'A network error. Are you connected to the void?';
            if (err.message.includes('upload') || err.message.includes('Upload')) userMessage = "Upload failed on all services. Try again later.";
            if (err.message.includes('converter deemed')) userMessage = 'The conversion API refused to process this. Try a simpler sticker.';
            await sendInteractive(client, m, `✦ ──『 FAILED 』── ⚝
▢ ${userMessage}\n└──✪ 𝐁𝐋𝐀𝐂𝐊 𝐏𝐀𝐍𝐓𝐇𝐄𝐑 ┃ ᴹᴰ ✪──`);
        }
    }
};