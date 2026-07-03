import ownerMiddleware from '../../utils/botUtil/Ownermiddleware.js';
import axios from 'axios';
import { herokuAppName, getHerokuApiKey } from '../../config/settings.js';
import { sendInteractive } from '../../lib/sendInteractive.js';

const SENSITIVE = ['heroku_api_key', 'api_key', 'database_url', 'session', 'secret', 'password', 'token', 'private_key', 'auth', 'key'];

function isSensitive(key) {
    return SENSITIVE.some(s => key.toLowerCase().includes(s));
}

export default async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m, text, prefix } = context;
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
        const herokuApiKey = getHerokuApiKey();

        if (!herokuAppName || !herokuApiKey) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return await sendInteractive(client, m, "╭━⬣ 「 GETVAR 』── ⚝\n┃ HEROKU_APP_NAME or HEROKU_API_KEY not set.\n╰━━━━━━━━━━━━━━━\n");
        }

        if (!text) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return await sendInteractive(client, m, `╭━⬣ 「 GETVAR 』── ⚝\n┃ Usage: ${prefix}getvar VAR_NAME\n╰━━━━━━━━━━━━━━━\n`);
        }

        const varName = text.trim().split(" ")[0];

        if (isSensitive(varName)) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return await sendInteractive(client, m, "╭━⬣ 「 GETVAR 』── ⚝\n┃ That variable is protected and cannot be retrieved. 🔒\n┃ For your own security.\n╰━━━━━━━━━━━━━━━\n");
        }

        if (m.isGroup) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return await sendInteractive(client, m, "╭━⬣ 「 GETVAR 』── ⚝\n┃ Use this command in your DM only, not in groups. 🔒\n╰━━━━━━━━━━━━━━━\n");
        }

        try {
            const response = await axios.get(`https://api.heroku.com/apps/${herokuAppName}/config-vars`, {
                headers: { Authorization: `Bearer ${herokuApiKey}`, Accept: "application/vnd.heroku+json; version=3" }
            });
            const varValue = response.data[varName];
            if (varValue !== undefined) {
                await sendInteractive(client, m, `╭━⬣ 「 GETVAR 』── ⚝
┃ ${varName} = ${varValue}\n╰━━━━━━━━━━━━━━━\n`);
            } else {
                await sendInteractive(client, m, `┃ Var "${varName}" doesn't exist.\n╰━━━━━━━━━━━━━━━\n`);
            }
        } catch (error) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            await sendInteractive(client, m, `┃ Failed to fetch var.\n┃ ${error.response?.data || error.message}\n╰━━━━━━━━━━━━━━━\n`);
        }
    });
};
