import fetch from 'node-fetch';
import { sendInteractive } from '../../lib/sendInteractive.js';
export default async (context) => {
  const { client, m, text, botname } = context;
  await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });


  let cap = `╭━⬣ 「 CARBON 』── ⚝
┃ Converted By ${botname}\n╰━━━━━━━━━━━━━━━\n`;

  if (m.quoted && m.quoted.text) {
    const forq = m.quoted.text;

    try {
      let response = await fetch('https://carbonara.solopov.dev/api/cook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: forq,
          backgroundColor: '#1F816D' }) });

      if (!response.ok) {
          await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
          return sendInteractive(client, m, `╭━⬣ 「 ERROR 』── ⚝
┃ API failed to fetch a valid response.\n┃ Try again later, genius.\n╰━━━━━━━━━━━━━━━\n`)
      }

      let per = await response.buffer();

      await client.sendMessage(m.chat, { image: per, caption: cap });
    } catch (error) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
      sendInteractive(client, m, `╭━⬣ 「 ERROR 』── ⚝
┃ An error occured, you broke it.\n┃ ${error}\n╰━━━━━━━━━━━━━━━\n`)
    }
  } else {
    sendInteractive(client, m, `╭━⬣ 「 CARBON 』── ⚝
┃ Quote a code message, idiot.\n╰━━━━━━━━━━━━━━━\n`);
  }
}