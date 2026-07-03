import axios from 'axios';
import { Sticker, StickerTypes } from 'wa-sticker-formatter';
import { sendInteractive } from '../../lib/sendInteractive.js';

export default {
  name: 'stickersearch',
  aliases: ['ss', 'stick', 'stickers'],
  description: 'Fetches GIF stickers from Tenor with your search term',
  run: async (context) => {
    const { client, m, text, botname } = context;

    if (!botname) {
      await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
      return sendInteractive(client, m, `┃ \n┃ Bot name not set. Check config.\n╰━━━━━━━━━━━━━━━\n`);
    }

    if (!text) {
      await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
      return sendInteractive(client, m, `┃ \n┃ Give me a search term.\n┃ Example: .s dancing cat\n╰━━━━━━━━━━━━━━━\n`);
    }

    await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

    try {
      const tenorApiKey = 'AIzaSyCyouca1_KKy4W_MG1xsPzuku5oa8W358c';
      const gifResponse = await axios.get(
        `https://tenor.googleapis.com/v2/search?q=${encodeURIComponent(text)}&key=${tenorApiKey}&client_key=my_project&limit=8&media_filter=gif`
      );

      const results = gifResponse.data.results;
      if (!results || results.length === 0) {
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
        return sendInteractive(client, m, `┃ \n┃ No stickers found for "${text}".\n┃ Try a different search term.\n╰━━━━━━━━━━━━━━━\n`);
      }

      for (let i = 0; i < Math.min(8, results.length); i++) {
        const gifUrl = results[i].media_formats.gif.url;
        const stickerMess = new Sticker(gifUrl, {
          pack: botname,
          author: '𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧',
          type: StickerTypes.FULL,
          categories: ['🤩', '🎉'],
          id: `12345-${i}`,
          quality: 60,
          background: 'transparent'
        });
        const stickerBuffer = await stickerMess.toBuffer();
        await client.sendMessage(m.chat, { sticker: stickerBuffer });
      }

      await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });

    } catch (error) {
      await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
      console.error(`Stickersearch error: ${error.message}`);
      await sendInteractive(client, m, `┃ \n┃ Failed to fetch stickers.\n┃ Service might be down. Try again.\n╰━━━━━━━━━━━━━━━\n`);
    }
  }
};
