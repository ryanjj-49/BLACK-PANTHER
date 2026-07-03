import middleware from '../../utils/botUtil/middleware.js';
import { sendInteractive } from '../../lib/sendInteractive.js';

export default async (context) => {
  await middleware(context, async () => {
    const { client, m, isBotAdmin, isAdmin } = context;
    await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

    if (!m.isGroup) {
      await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
      return sendInteractive(client, m, `╭━⬣ 「 ERROR 』── ⚝
┃ Yo, genius, this command's\n┃ for groups. Quit embarrassing\n┃ yourself.\n╰━━━━━━━━━━━━━━━\n`);
    }

    if (!isAdmin) {
      await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
      return sendInteractive(client, m, `╭━⬣ 「 ERROR 』── ⚝
┃ Pfft, you? Admin? Get real,\n┃ loser. Only admins can do this.\n╰━━━━━━━━━━━━━━━\n`);
    }

    if (!isBotAdmin) {
      await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
      return sendInteractive(client, m, `╭━⬣ 「 ERROR 』── ⚝
┃ I'm not admin, dipshit.\n┃ Promote me or stop wasting\n┃ my time.\n╰━━━━━━━━━━━━━━━\n`);
    }

    const responseList = await client.groupRequestParticipantsList(m.chat);

    if (responseList.length === 0) {
      await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
      return sendInteractive(client, m, `╭━⬣ 「 NO REQUESTS 』── ⚝
┃ Wow, no one's dumb enough to\n┃ wanna join this trash group.\n┃ No requests to reject, moron.\n╰━━━━━━━━━━━━━━━\n`);
    }

    for (const participant of responseList) {
      try {
        const response = await client.groupRequestParticipantsUpdate(
          m.chat,
          [participant.jid],
          "reject"
        );
        console.log(response);
      } catch (error) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
        console.error('Error rejecting participant:', error);
        return sendInteractive(client, m, `╭━⬣ 「 ERROR 』── ⚝
┃ Screw-up alert! Couldn't reject\n┃ @${participant.jid.split('@')[0]}.\n┃ Fix your damn group, idiot.\n╰━━━━━━━━━━━━━━━\n`, { mentions: [participant.jid] });
      }
    }

    sendInteractive(client, m, `╭━⬣ 「 REJECTED 』── ⚝
┃ All those pathetic join requests?\n┃ REJECTED. Go cry about it, losers.\n╰━━━━━━━━━━━━━━━\n`);
  });
};
