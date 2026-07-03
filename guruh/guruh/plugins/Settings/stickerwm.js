import { getSettings, updateSetting } from '../../database/config.js';
import ownerMiddleware from '../../utils/botUtil/Ownermiddleware.js';
import { sendInteractive } from '../../lib/sendInteractive.js';

export default async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m, args } = context;
        const newStickerWM = args.join(" ") || null;  

        let settings = await getSettings();

        if (!settings) {
            await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return await sendInteractive(client, m, "┃ Settings not found. Something's seriously broken.\n╰━━━━━━━━━━━━━━━\n");
        }

        if (newStickerWM !== null) {
            if (newStickerWM === 'null') {
                if (!settings.packname) {
                    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
                    return await sendInteractive(client, m, "┃ Bot already has no sticker watermark, genius.\n╰━━━━━━━━━━━━━━━\n");
                }
                await updateSetting('packname', '');
                await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
                await sendInteractive(client, m, "┃ Sticker watermark removed. Happy now?\n╰━━━━━━━━━━━━━━━\n");
            } else {
                if (settings.packname === newStickerWM) {
                    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
                    return await sendInteractive(client, m, `┃ Watermark already set to: ${newStickerWM}\n┃ Stop wasting my time.\n╰━━━━━━━━━━━━━━━\n`);
                }
                await updateSetting('packname', newStickerWM);
                await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
                await sendInteractive(client, m, `╭━⬣ 「 STICKER WM 』── ⚝
┃ Watermark updated to: ${newStickerWM}\n╰━━━━━━━━━━━━━━━\n`);
            }
        } else {
            await sendInteractive(client, m, `╭━⬣ 「 STICKER WM 』── ⚝
┃ Current watermark: ${settings.packname || 'None set'}\n┃ \n┃ Use '${settings.prefix}stickerwm null' to remove\n┃ Use '${settings.prefix}stickerwm <text>' to set\n╰━━━━━━━━━━━━━━━\n`);
        }
    });
};
