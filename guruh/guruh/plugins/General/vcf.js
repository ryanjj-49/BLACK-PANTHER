import fs from 'fs';
import { sendInteractive } from '../../lib/sendInteractive.js';

export default async (context) => {
    const { client, m, participants } = context;

    if (!m.isGroup) {
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
        return sendInteractive(client, m, `╭━⬣ 「 Eʀʀᴏʀ 』── ⚝
┃ Command meant for groups.\n╰━━━━━━━━━━━━━━━\n`);
    }

    try {
        const gcdata = await client.groupMetadata(m.chat);
        const vcard = gcdata.participants
            .map((a, i) => {
                const number = a.id.split('@')[0];
                return `BEGIN:VCARD\nVERSION:3.0\nFN:[${i}] +${number}\nTEL;type=CELL;type=VOICE;waid=${number}:+${number}\nEND:VCARD`;
            })
            .join('\n');

        const cont = './contacts.vcf';

        await sendInteractive(client, m, `╭━⬣ 「 VCF 』── ⚝
┃ A moment, BLACK-PANTHER-MD is compiling\n┃ ${gcdata.participants.length} contacts into a VCF...\n╰━━━━━━━━━━━━━━━\n`);

        await fs.promises.writeFile(cont, vcard);
        await sendInteractive(client, m, `╭━⬣ 「 VCF 』── ⚝
┃ Import this VCF in a separate\n┃ email account to avoid messing\n┃ with your contacts...\n╰━━━━━━━━━━━━━━━\n`);

        await client.sendMessage(
            m.chat,
            {
                document: fs.readFileSync(cont),
                mimetype: 'text/vcard',
                fileName: 'Group contacts.vcf',
                caption: `╭━⬣ 「 VCF 』── ⚝
┃ VCF for ${gcdata.subject}\n┃ ${gcdata.participants.length} contacts\n╰━━━━━━━━━━━━━━━\n`
            },
            { ephemeralExpiration: 86400 }
        );

        await fs.promises.unlink(cont);
    } catch (error) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
        console.error(`VCF error: ${error.message}`);
        await sendInteractive(client, m, `╭━⬣ 「 Eʀʀᴏʀ 』── ⚝
┃ Failed to generate VCF.\n┃ Try again later.\n╰━━━━━━━━━━━━━━━\n`);
    }
};
