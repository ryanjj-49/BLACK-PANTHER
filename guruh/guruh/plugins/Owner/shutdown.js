import ownerMiddleware from '../../utils/botUtil/Ownermiddleware.js';
import { sendInteractive } from '../../lib/sendInteractive.js';

export default async (context) => {
    await ownerMiddleware(context, async () => {
        const { m } = context;
        await client.sendMessage(m.chat, { react: { text: '💀', key: m.reactKey } });
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
        await sendInteractive(client, m, `╭━⬣ 「 SHUTDOWN 』── ⚝
┃ 💀 BLACK-PANTHER-MD going offline...\n┃ Don't cry.\n╰━━━━━━━━━━━━━━━\n`);
        setTimeout(() => process.exit(0), 2000);
    });
};
