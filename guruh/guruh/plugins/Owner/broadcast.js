import ownerMiddleware from '../../utils/botUtil/Ownermiddleware.js';
import { sendInteractive } from '../../lib/sendInteractive.js';

export default async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m, text, participants, pushname } = context;
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

if (!text) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
    return sendInteractive(client, m, `┃ \n┃ Provide a broadcast message!\n╰━━━━━━━━━━━━━━━\n`);
}
if (!m.isGroup) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
    return sendInteractive(client, m, `┃ \n┃ This command is meant for groups.\n╰━━━━━━━━━━━━━━━\n`);
}

let getGroups = await client.groupFetchAllParticipating() 
         let groups = Object.entries(getGroups) 
             .slice(0) 
             .map(entry => entry[1]) 
         let res = groups.map(v => v.id) 

await sendInteractive(client, m, `╭━⬣ 「 BROADCAST 』── ⚝
┃ Sending broadcast message...\n╰━━━━━━━━━━━━━━━\n`)

for (let i of res) { 


let txt = `╭━⬣ 「 BROADCAST 』── ⚝
┃ Message: ${text}\n┃ \n┃ Written by: ${pushname}\n╰━━━━━━━━━━━━━━━\n` 

await client.sendMessage(i, { 
                 image: { 
                     url: "https://qu.ax/XxQwp.jpg" 
                 }, mentions: participants.map(a => a.id),
                 caption: `${txt}` 
             }) 
         } 
await sendInteractive(client, m, `╭━⬣ 「 DONE 』── ⚝
┃ Message sent across all groups.\n╰━━━━━━━━━━━━━━━\n`);
})

}
