import fetch from 'node-fetch';
import { sendInteractive } from '../../lib/sendInteractive.js';

export default {
  name: 'pinterest',
  aliases: ['pin', 'pinterestimg'],
  description: 'Fetches Pinterest images for your basic needs',
  run: async (context) => {
    const { client, m, text } = context;
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

    try {
      const query = (text || '').trim();
      if (!query) {
          await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
          return sendInteractive(client, m, "╭━⬣ 「 PINTEREST 』── ⚝\n┃ Give me a search term, you visually impaired fool.\n╰━━━━━━━━━━━━━━━\n");
      }

      await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

      const apiUrl = `https://mkzstyleee.vercel.app/search/pinterest?q=${encodeURIComponent(query)}&apikey=FREE-OKBCJB3N-Q9TC`;
      const res = await fetch(apiUrl);
      const data = await res.json();

      if (!data.status || !data.result || data.result.length === 0) {
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
        return sendInteractive(client, m, `┃ No Pinterest images for "${query}".\n┃ Your search is as pointless as you are.\n╰━━━━━━━━━━━━━━━\n`);
      }

      const images = data.result.filter(img => img !== null).slice(0, 5);
      
      if (images.length === 0) {
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
        return sendInteractive(client, m, `┃ No valid images found.\n┃ Even Pinterest rejected your taste.\n╰━━━━━━━━━━━━━━━\n`);
      }

      await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });

      for (const [i, imageUrl] of images.entries()) {
        try {
          const response = await fetch(imageUrl);
          const arrayBuffer = await response.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);

          const caption = i === 0 
            ? `╭━⬣ 「 PINTEREST 』── ⚝
┃ Query: ${query}\n╰━━━━━━━━━━━━━━━\n`
            : `┃ Image ${i+1} of ${images.length}`;

          await client.sendMessage(m.chat, {
            image: buffer,
            caption: caption
          }, { quoted: i === 0 ? m : null });

          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (imgError) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
          console.error(`Failed to fetch image ${i}:`, imgError.message);
        }
      }

    } catch (error) {
      console.error('Pinterest error:', error);
      await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
      await sendInteractive(client, m, `╭━⬣ 「 PINTEREST ERROR 』── ⚝
┃ Search failed. Your taste is probably trash anyway.\n╰━━━━━━━━━━━━━━━\n`);
    }
  }
};