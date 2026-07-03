import axios from 'axios';
import { sendInteractive } from '../../lib/sendInteractive.js';

export default {
    name: 'country',
    aliases: ['countryinfo', 'nation', 'flag'],
    description: 'Get information about a country',
    run: async (context) => {
        const { client, m, text } = context;
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
        const query = (text || '').trim();
        if (!query) {
            return sendInteractive(client, m, `╭━⬣ 「 Cᴏᴜɴᴛʀʏ Iɴғᴏ 』── ⚝
┃
┃ Usage: .country Kenya\n╰━━━━━━━━━━━━━━━\n`);
        }
        try {
            await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
            const res = await axios.get(`https://restcountries.com/v3.1/name/${encodeURIComponent(query)}?fullText=true`, { timeout: 8000 });
            const c = res.data?.[0];
            if (!c) throw new Error('not found');
            const name = c.name?.common || query;
            const official = c.name?.official || '';
            const capital = (c.capital || ['?'])[0];
            const region = c.region || '?';
            const sub = c.subregion || '';
            const pop = (c.population || 0).toLocaleString();
            const currencies = Object.values(c.currencies || {}).map(cu => `${cu.name} (${cu.symbol || '?'})`).join(', ') || '?';
            const langs = Object.values(c.languages || {}).join(', ') || '?';
            const flag = c.flag || '';
            await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
            return sendInteractive(client, m, `╭━⬣ 「 Cᴏᴜɴᴛʀʏ Iɴғᴏ 』── ⚝
┃
┃ ${flag} ${name}\n┃ 📋 Official: ${official}\n┃ 🏙️ Capital: ${capital}\n┃ 🌍 Region: ${region}${sub ? ' / ' + sub : ''}\n┃ 👥 Population: ${pop}\n┃ 💰 Currency: ${currencies}\n┃ 🗣️ Language(s): ${langs}\n╰━━━━━━━━━━━━━━━\n`);
        } catch {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
            return sendInteractive(client, m, `╭━⬣ 「 Cᴏᴜɴᴛʀʏ Iɴғᴏ 』── ⚝
┃
┃ Country not found. Did you make it up?\n╰━━━━━━━━━━━━━━━\n`);
        }
    }
};
