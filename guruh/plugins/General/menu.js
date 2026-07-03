import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { sendInteractive } from '../../lib/sendInteractive.js';

export default {
    name: 'menu',
    aliases: ['commands', 'list', 'cmds', 'm', 'cmd', 'commandlist', 'allcmds'],
    description: 'Displays the BLACK-PANTHER-MD command menu',
    run: async (context) => {
        const { client, m, mode, pict, botname, prefix } = context;

        await client.sendMessage(m.chat, { react: { text: '🤖', key: m.reactKey } });

        const menuText =
`✦ ──『 𝐁ᴏᴛ Iɴꜰᴏ 』── ⚝
▢ 𝐔𝐬𝐞𝐫    : @${m.sender.split('@')[0].split(':')[0]}
▢ 𝐁𝐨𝐭     : ${botname || 'BLACK-PANTHER-MD'}
▢ 𝐏𝐫𝐞𝐟𝐢𝐱  : ${prefix}
▢ 𝐌𝐨𝐝𝐞    : ${mode}
└──✪ 𝐁𝐋𝐀𝐂𝐊 𝐏𝐀𝐍𝐓𝐇𝐄𝐑 ┃ ᴹᴰ ✪──

✦ ──『 Cᴏʀᴇ Cᴏᴍᴍᴀɴᴅs 』── ⚝
▢ ${prefix}fullmenu  — All commands list
▢ ${prefix}ping      — Check bot speed
▢ ${prefix}settings  — Bot settings
▢ ${prefix}uptime    — Bot uptime
▢ ${prefix}dev       — Developer contact
▢ ${prefix}report    — Report a bug
└──✪ 𝐁𝐋𝐀𝐂𝐊 𝐏𝐀𝐍𝐓𝐇𝐄𝐑 ┃ ᴹᴰ ✪──

✦ ──『 Cᴀᴛᴇɢᴏʀʏ Mᴇɴᴜs 』── ⚝
▢ ${prefix}generalmenu   — General
▢ ${prefix}settingsmenu  — Settings
▢ ${prefix}ownermenu     — Owner only
▢ ${prefix}groupmenu     — Group mgmt
▢ ${prefix}aimenu        — AI & chat
▢ ${prefix}downloadmenu  — Downloads
▢ ${prefix}editingmenu   — Editing
▢ ${prefix}effectsmenu   — Text effects
▢ ${prefix}utilsmenu     — Utilities
▢ ${prefix}privacymenu   — Privacy
└──✪ 𝐁𝐋𝐀𝐂𝐊 𝐏𝐀𝐍𝐓𝐇𝐄𝐑 ┃ ᴹᴰ ✪──`;

        if (pict && Buffer.isBuffer(pict)) {
            await client.sendMessage(m.chat, {
                image: pict,
                caption: menuText,
                mentions: [m.sender],
                contextInfo: {
                    externalAdReply: {
                        title: `${botname || 'BLACK PANTHER MD'}`,
                        body: `Yo, ${m.pushName}! Ready to fuck shit up?`,
                        mediaType: 1,
                        thumbnail: pict,
                        mediaUrl: '',
                        sourceUrl: 'https://github.com/koyoteh/BLACK-PANTHER',
                        showAdAttribution: false,
                        renderLargerThumbnail: true
                    }
                }
            }).catch(() => sendInteractive(client, m, menuText));
        } else {
            await client.sendMessage(m.chat, {
                text: menuText,
                mentions: [m.sender],
                contextInfo: {
                    externalAdReply: {
                        title: `${botname || 'BLACK PANTHER MD'}`,
                        body: `Yo, ${m.pushName}! Ready to fuck shit up?`,
                        mediaType: 1,
                        thumbnail: null,
                        mediaUrl: '',
                        sourceUrl: 'https://github.com/koyoteh/BLACK-PANTHER',
                        showAdAttribution: false,
                        renderLargerThumbnail: false
                    }
                }
            }).catch(() => sendInteractive(client, m, menuText));
        }

        await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });

        // Play a random menu audio if available — optional, never fails the command
        try {
            const xhClintonPaths = [
                path.join(__dirname, 'GuruTech'),
                path.join(process.cwd(), 'GuruTech'),
                path.join(__dirname, '..', 'GuruTech')
            ];
            let audioFolder = null;
            for (const folderPath of xhClintonPaths) {
                if (fs.existsSync(folderPath)) { audioFolder = folderPath; break; }
            }
            if (audioFolder) {
                const menuFiles = ['menu1.mp3', 'menu2.mp3', 'menu3.mp3', 'menu4.mp3'];
                const possibleFiles = menuFiles.map(f => path.join(audioFolder, f)).filter(f => fs.existsSync(f));
                if (possibleFiles.length > 0) {
                    const randomFile = possibleFiles[Math.floor(Math.random() * possibleFiles.length)];
                    await new Promise(resolve => setTimeout(resolve, 500));
                    try {
                        const audioBuffer = fs.readFileSync(randomFile);
                        await client.sendMessage(m.chat, { audio: audioBuffer, ptt: true, mimetype: 'audio/mpeg', fileName: 'panther-menu.m4a' });
                    } catch {
                        await client.sendMessage(m.chat, { audio: { url: randomFile }, ptt: true, mimetype: 'audio/mpeg', fileName: 'panther-menu.m4a' }).catch(() => {});
                    }
                }
            }
        } catch { /* audio is optional — ignore all failures */ }
    }
};
