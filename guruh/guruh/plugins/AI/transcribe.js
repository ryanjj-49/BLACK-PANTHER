import axios from 'axios';
import FormData from 'form-data';
import crypto from 'crypto';
import { sendInteractive } from '../../lib/sendInteractive.js';

export default async (context) => {
  const { client, m } = context;
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
  const quoted = m.quoted || m;
  const mime = (quoted.msg || quoted).mimetype || '';

  if (!/audio|video/.test(mime)) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
    return sendInteractive(client, m, `╭━⬣ 「 Eʀʀᴏʀ 』── ⚝
┃ Send or reply to an audio/video file with the caption _transcribe_ idiot\n╰━━━━━━━━━━━━━━━\n`);
  }

  await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

  try {
    const buffer = await m.quoted.download();

    if (buffer.length > 5 * 1024 * 1024) {
      await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
      return sendInteractive(client, m, `╭━⬣ 「 Eʀʀᴏʀ 』── ⚝
┃ Maximum file size is 5 MB.\n╰━━━━━━━━━━━━━━━\n`);
    }

    const result = await transcribeWithTalknotes(buffer);

    if (!result || !result.text) {
      await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
      return sendInteractive(client, m, `╭━⬣ 「 Fᴀɪʟᴇᴅ 』── ⚝
┃ Failed to extract text. Please try again later.\n╰━━━━━━━━━━━━━━━\n`);
    }

    await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
    return sendInteractive(client, m, `╭━⬣ 「 Tʀᴀɴsᴄʀɪᴘᴛɪᴏɴ 』── ⚝
┃ ${result.text}\n╰━━━━━━━━━━━━━━━\n`);
  } catch (error) {
    console.error(error);
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
    sendInteractive(client, m, `╭━⬣ 「 Eʀʀᴏʀ 』── ⚝
┃ An error occurred while processing the file.\n╰━━━━━━━━━━━━━━━\n`);
  }
};

function generateToken(secretKey) {
  const timestamp = Date.now().toString();
  const hmac = crypto.createHmac('sha256', secretKey);
  hmac.update(timestamp);
  const token = hmac.digest('hex');

  return {
    'x-timestamp': timestamp,
    'x-token': token
  };
}

async function transcribeWithTalknotes(buffer) {
  try {
    const form = new FormData();
    form.append('file', buffer, {
      filename: 'audio.mp3',
      contentType: 'audio/mpeg'
    });

    const tokenData = generateToken('w0erw90wr3rnhwoi3rwe98sdfihqio432033we8rhoeiw');

    const headers = {
      ...form.getHeaders(),
      ...tokenData,
      'referer': 'https://talknotes.io/',
      'origin': 'https://talknotes.io',
      'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36' };

    const { data } = await axios.post('https://api.talknotes.io/tools/converter', form, { headers });

    return data;
  } catch (err) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
    console.error('Talknotes error:', err.message);
    return null;
  }
}