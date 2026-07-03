import middleware from '../../utils/botUtil/middleware.js';
import { parseDelay, scheduleAction, cancelScheduled } from '../../lib/groupTimers.js';
import { sendInteractive } from '../../lib/sendInteractive.js';

export default async (context) => {
    await middleware(context, async () => {
        const { client, m, args } = context;
        const delayMs = parseDelay(args?.[0]);
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

        if (delayMs !== null) {
            const label = args[0];
            cancelScheduled(m.chat, 'close');
            scheduleAction(m.chat, 'close', delayMs, async () => {
                try {
                    await client.groupSettingUpdate(m.chat, 'announcement');
                    await sendInteractive(client, m, `╭━⬣ 「 CLOSED 』── ⚝
┃ ⏰ Scheduled close executed!\n┃ Group is now closed.\n╰━━━━━━━━━━━━━━━\n`);
                } catch {}
            });
            await client.sendMessage(m.chat, { react: { text: '⏰', key: m.reactKey } });
            return m.reply(`╭━⬣ 「 TIMER SET 』── ⚝
┃ ⏰ Group will close in *${label}*.\n┃ Use .close to cancel & close now.\n╰━━━━━━━━━━━━━━━\n`);
        }

        try {
            cancelScheduled(m.chat, 'close');
            await client.groupSettingUpdate(m.chat, 'announcement');
            await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
            m.reply(`╭━⬣ 「 CLOSED 』── ⚝
┃ Group closed. Shut up now.\n╰━━━━━━━━━━━━━━━\n`);
        } catch (e) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            m.reply(`┃ Failed to close group: ${e.message?.slice(0, 60)}\n╰━━━━━━━━━━━━━━━\n`);
        }
    });
};
