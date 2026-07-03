import axios from 'axios';
import { sendInteractive } from '../../lib/sendInteractive.js';

export default async (context) => {
    const { client, m, text } = context;
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

    if (!text) {
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
        return sendInteractive(client, m, `╭━⬣ 「 Cᴏᴅᴇɢᴇɴ 』── ⚝
┃ Example usage:\n┃ .codegen Function to calculate triangle area|Python\n╰━━━━━━━━━━━━━━━\n`);
    }

    let [prompt, language] = text.split("|").map(v => v.trim());

    if (!prompt || !language) {
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
        return sendInteractive(client, m, `╭━⬣ 「 Eʀʀᴏʀ 』── ⚝
┃ Invalid format!\n┃ Use the format: .codegen <prompt>|<language>\n┃ Example: .codegen Check for prime number|JavaScript\n╰━━━━━━━━━━━━━━━\n`);
    }

    await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
    try {
        const payload = {
            customInstructions: prompt,
            outputLang: language
        };

        const { data } = await axios.post("https://www.codeconvert.ai/api/generate-code", payload);

        if (!data || typeof data !== "string") {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return sendInteractive(client, m, `╭━⬣ 「 Eʀʀᴏʀ 』── ⚝
┃ Failed to retrieve code from API.\n╰━━━━━━━━━━━━━━━\n`);
        }

        await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
        sendInteractive(client, m, `╭━⬣ 「 Cᴏᴅᴇɢᴇɴ (${language}) 』── ⚝
` + "```" + language.toLowerCase() + "\n" + data.trim() + "\n```" + `\n╰━━━━━━━━━━━━━━━\n`);

    } catch (error) {
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
        console.error(error);
        sendInteractive(client, m, `╭━⬣ 「 Eʀʀᴏʀ 』── ⚝
┃ An error occurred while processing your request.\n╰━━━━━━━━━━━━━━━\n`);
    }
};