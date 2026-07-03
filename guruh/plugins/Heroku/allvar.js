import ownerMiddleware from '../../utils/botUtil/Ownermiddleware.js';
import axios from 'axios';
import { herokuAppName, getHerokuApiKey } from '../../config/settings.js';
import { sendInteractive } from '../../lib/sendInteractive.js';

const SENSITIVE = ['heroku_api_key', 'api_key', 'database_url', 'session', 'secret', 'password', 'token', 'private_key', 'auth', 'key'];

function isSensitive(key) {
    const lk = key.toLowerCase();
    return SENSITIVE.some(s => lk.includes(s));
}

export default async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m } = context;
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
        const herokuApiKey = getHerokuApiKey();

        if (!herokuAppName || !herokuApiKey) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return await sendInteractive(client, m, "✦ ──『 HEROKU VARS 』── ⚝\n▢ HEROKU_APP_NAME or HEROKU_API_KEY not set.\n└──✪ 𝐁𝐋𝐀𝐂𝐊 𝐏𝐀𝐍𝐓𝐇𝐄𝐑 ┃ ᴹᴰ ✪──");
        }

        try {
            const response = await axios.get(`https://api.heroku.com/apps/${herokuAppName}/config-vars`, {
                headers: { Authorization: `Bearer ${herokuApiKey}`, Accept: "application/vnd.heroku+json; version=3" }
            });

            const configVars = response.data;
            if (!configVars || Object.keys(configVars).length === 0) {
                await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
                return await sendInteractive(client, m, "✦ ──『 HEROKU VARS 』── ⚝\n▢ No config vars found.\n└──✪ 𝐁𝐋𝐀𝐂𝐊 𝐏𝐀𝐍𝐓𝐇𝐄𝐑 ┃ ᴹᴰ ✪──");
            }

            let msg = `✦ ──『 HEROKU VARS 』── ⚝
`;
            for (const [key, value] of Object.entries(configVars)) {
                msg += `▢ ${key}: ${isSensitive(key) ? '**REDACTED**' : value}\n`;
            }
            msg += "└──✪ 𝐁𝐋𝐀𝐂𝐊 𝐏𝐀𝐍𝐓𝐇𝐄𝐑 ┃ ᴹᴰ ✪──";

            const dmJid = typeof m.sender === 'string' && m.sender.endsWith('@s.whatsapp.net') ? m.sender : null;
            if (dmJid) {
                await client.sendMessage(dmJid, { text: msg });
                await sendInteractive(client, m, "✦ ──『 HEROKU VARS 』── ⚝\n▢ Vars sent to your DM only. 🔒\n▢ Sensitive keys are always redacted.\n└──✪ 𝐁𝐋𝐀𝐂𝐊 𝐏𝐀𝐍𝐓𝐇𝐄𝐑 ┃ ᴹᴰ ✪──");
            } else {
                await sendInteractive(client, m, "✦ ──『 HEROKU VARS 』── ⚝\n▢ Couldn't resolve your JID for DM.\n▢ Use this command from DM only.\n└──✪ 𝐁𝐋𝐀𝐂𝐊 𝐏𝐀𝐍𝐓𝐇𝐄𝐑 ┃ ᴹᴰ ✪──");
            }
        } catch (error) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            await sendInteractive(client, m, `✦ ──『 HEROKU VARS 』── ⚝\n▢ Failed to fetch config vars.\n▢ ${error.response?.data || error.message}\n└──✪ 𝐁𝐋𝐀𝐂𝐊 𝐏𝐀𝐍𝐓𝐇𝐄𝐑 ┃ ᴹᴰ ✪──`);
        }
    });
};
