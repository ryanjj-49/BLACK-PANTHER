import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { botname } from '../../config/settings.js';
import { sendInteractive } from '../../lib/sendInteractive.js';

export default {
  name: 'alive',
  aliases: ['bot', 'test', 'isalive', 'status'],
  description: 'Checks if the bot is alive and running',
  run: async (context) => {
    const { client, m, prefix, pict } = context;
    await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
    await client.sendMessage(m.chat, { react: { text: '🤖', key: m.reactKey } });
    const bName = botname || 'BLACK-PANTHER-MD';

    try {
      const uptime = process.uptime();
      const days = Math.floor(uptime / 86400);
      const hours = Math.floor((uptime % 86400) / 3600);
      const mins = Math.floor((uptime % 3600) / 60);
      const secs = Math.floor(uptime % 60);
      const uptimeStr = `${days}d ${hours}h ${mins}m ${secs}s`;

      const caption = `✦ ──『 I'ᴍ Aʟɪᴠᴇ 』── ⚝
▢ @${m.sender.split('@')[0]}, I'm up and running.\n▢ Been alive for ${uptimeStr}.\n▢ Type *${prefix}menu* if you need\n▢ help, which you probably do.\n└──✪ 𝐁𝐋𝐀𝐂𝐊 𝐏𝐀𝐍𝐓𝐇𝐄𝐑 ┃ ᴹᴰ ✪──`;

      if (pict && Buffer.isBuffer(pict)) {
        await client.sendMessage(m.chat, {
          image: pict,
          caption: caption,
          mentions: [m.sender]
        });
      } else {
        await client.sendMessage(m.chat, {
          text: caption,
          mentions: [m.sender]
        });
      }

      const possibleAudioPaths = [
        path.join(__dirname, '..', 'GuruTech', 'test.mp3'),
        path.join(process.cwd(), 'GuruTech', 'test.mp3'),
        path.join(__dirname, 'GuruTech', 'test.mp3'),
      ];

      for (const audioPath of possibleAudioPaths) {
        try {
          if (fs.existsSync(audioPath)) {
            await client.sendMessage(m.chat, {
              audio: { url: audioPath },
              ptt: true,
              mimetype: 'audio/mpeg',
              fileName: 'panther-alive.mp3'
            });
            break;
          }
        } catch (err) {}
      }

    } catch (error) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
      await sendInteractive(client, m, `✦ ──『 Cʀᴀsʜᴇᴅ 』── ⚝
▢ Something broke, @${m.sender.split('@')[0].split(':')[0]}.\n▢ Error: ${error.message}\n▢ Try again when I feel like it.\n└──✪ 𝐁𝐋𝐀𝐂𝐊 𝐏𝐀𝐍𝐓𝐇𝐄𝐑 ┃ ᴹᴰ ✪──`);
    }
  }
};
