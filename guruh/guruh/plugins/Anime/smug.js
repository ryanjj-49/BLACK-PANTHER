import { getAnime } from '../../lib/api.js';
import { sendInteractive } from '../../lib/sendInteractive.js';

export default {
    name: 'smug',
    aliases: ['animesmug', 'smugface'],
    description: 'Send a smug anime face',
    run: async (context) => {
        const { client, m } = context;
        try {
            await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
            const url = await getAnime('smug');
            await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
            await client.sendMessage(m.chat, {
                image: { url },
                caption: `╭━⬣ 「 Sᴍᴜɢ 』── ⚝
╰━━━━━━━━━━━━━━━\n`
            });
        } catch (error) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
            await sendInteractive(client, m, `╭━⬣ 「 Eʀʀᴏʀ 』── ⚝
┃ Smug unavailable!\n╰━━━━━━━━━━━━━━━\n`);
        }
    }
};
