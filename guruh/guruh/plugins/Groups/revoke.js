import middleware from '../../utils/botUtil/middleware.js';
import { sendInteractive } from '../../lib/sendInteractive.js';

export default async (context) => {
    await middleware(context, async () => {
        const { client, m, groupMetadata } = context;
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

        try {
            await client.groupRevokeInvite(m.chat);
            const newCode = await client.groupInviteCode(m.chat);
            const newLink = `https://chat.whatsapp.com/${newCode}`;
            const dmJid = typeof m.sender === 'string' && m.sender.endsWith('@s.whatsapp.net') ? m.sender : null;
            await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
            if (dmJid) {
                await sendInteractive(client, m, `╭━⬣ 「 REVOKED 』── ⚝
┃ Group link revoked!\n┃ New link sent to your DM.\n╰━━━━━━━━━━━━━━━\n`);
                await client.sendMessage(dmJid, {
                    text: `╭━⬣ 「 NEW LINK 』── ⚝
┃ ${newLink}\n┃ \n┃ New group link for ${groupMetadata?.subject || m.chat}\n╰━━━━━━━━━━━━━━━\n`
                });
            } else {
                await sendInteractive(client, m, `╭━⬣ 「 REVOKED 』── ⚝
┃ Group link revoked!\n┃ New link: ${newLink}\n╰━━━━━━━━━━━━━━━\n`);
            }
        } catch (e) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            await sendInteractive(client, m, `┃ Failed to revoke link: ${e.message?.slice(0, 60)}\n╰━━━━━━━━━━━━━━━\n`);
        }
    });
};
