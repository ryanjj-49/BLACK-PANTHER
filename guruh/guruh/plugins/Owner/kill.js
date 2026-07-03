import middleware from '../../utils/botUtil/middleware.js';
import { sendInteractive } from '../../lib/sendInteractive.js';

export default async (context) => {
    await middleware(context, async () => {
        const { client, m, isBotAdmin } = context;
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

        if (!m.isGroup) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return sendInteractive(client, m, `┃ \n┃ This command is meant for groups.\n╰━━━━━━━━━━━━━━━\n`);
        }
        if (!isBotAdmin) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return sendInteractive(client, m, `┃ \n┃ I need admin privileges.\n╰━━━━━━━━━━━━━━━\n`);
        }

        const normalizeJid = (jid) => {
            if (!jid) return '';
            return jid.split('@')[0].split(':')[0].replace(/\D/g, '') + '@s.whatsapp.net';
        };

        const groupMetadata = await client.groupMetadata(m.chat);
        const participants = groupMetadata.participants;
        const botJid = normalizeJid(client.user.id);
        const senderJid = normalizeJid(m.sender);

        const usersToKick = participants.filter(p => {
            const pJid = normalizeJid(p.jid || p.id);
            return pJid !== botJid && pJid !== senderJid;
        });

        await client.sendMessage(m.chat, { react: { text: '⚠️', key: m.reactKey } });
        await sendInteractive(client, m, `╭━⬣ 「 TERMINATION 』── ⚝
┃ GROUP TERMINATION INITIATED\n┃ Removing ${usersToKick.length} participants.\n┃ The group will be renamed.\n┃ THIS PROCESS CANNOT BE STOPPED.\n╰━━━━━━━━━━━━━━━\n`);

        try { await client.groupUpdateSubject(m.chat, "Proven Useless🦄🚮"); } catch (e) {}
        try { await client.groupUpdateDescription(m.chat, "Terminated by Tσxιƈ-ɱԃȥ\n\nA collection of digital disappointments. Your contributions were as valuable as your existence—negligible."); } catch (e) {}
        try { await client.groupRevokeInvite(m.chat); } catch (e) {}
        try { await client.groupSettingUpdate(m.chat, 'announcement'); } catch (e) {}

        for (const p of usersToKick) {
            try {
                const jid = normalizeJid(p.jid || p.id);
                await client.groupParticipantsUpdate(m.chat, [jid], 'remove');
                await new Promise(res => setTimeout(res, 500));
            } catch (e) {}
        }

        await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
        await sendInteractive(client, m, `╭━⬣ 「 COMPLETE 』── ⚝
┃ TERMINATION COMPLETE\n┃ All participants removed.\n┃ Group secured.\n╰━━━━━━━━━━━━━━━\n`);
    });
};
