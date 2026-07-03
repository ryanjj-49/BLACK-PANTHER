import { generateWAMessageFromContent } from '@whiskeysockets/baileys';
import { getSettings, updateSetting } from '../../database/config.js';
import { getDeviceMode } from '../../lib/deviceMode.js';
import { sendInteractive } from '../../lib/sendInteractive.js';

const DEV_NUMBER = '254114885159';

export default {
    name: 'aiassist',
    aliases: ['devai', 'aiassist'],
    description: 'Toggle AI Assistant GitHub AI (dev only)',
    run: async (context) => {
        const { client, m, args, prefix } = context;
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

        const senderNum = (m.sender || '').split('@')[0].split(':')[0];
        const fmt = (title, lines) => {
            const body = (Array.isArray(lines) ? lines : [lines]).map(l => `┃ ${l}`).join('\n');
            return `╭━⬣ 「 ${title} 』── ⚝
┃
${body}\n╰━━━━━━━━━━━━━━━\n`;
        };

        if (senderNum !== DEV_NUMBER) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
            return client.sendMessage(m.chat, {
                text: fmt('AI ASSIST', ['Access denied.', 'Dev-only feature. Not your toy.'])
            });
        }

        try {
            const settings = await getSettings();
            const value = (args[0] || '').toLowerCase();

            if (value === 'on' || value === 'off') {
                const newState = value === 'on';
                await updateSetting('aiassist', newState);
                await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
                return client.sendMessage(m.chat, {
                    text: fmt('AI ASSIST', newState
                        ? ['Status: ✅ ON', 'GitHub AI agent active. Just text me GitHub tasks.']
                        : ['Status: ❌ OFF', 'GitHub AI disabled.'])
                });
            }

            const isOn = settings.aiassist === true || settings.aiassist === 'true';

                        const _devMode = await getDeviceMode();
            if (_devMode === 'ios') {
          await client.sendMessage(m.chat, { react: { text: '📋', key: m.reactKey } });
          await sendInteractive(client, m, `╭━⬣ 「 AI ASSIST 』── ⚝
┃ Status: ${settings.aiassist ? 'ON ✅' : 'OFF ❌'}\n┃ \n┃ Options:\n┃ ${prefix}aiassist on\n┃ ${prefix}aiassist off\n╰━━━━━━━━━━━━━━━\n> 🌐 hosting.wa.me/254105521300`);
      } else {
    const _msg = generateWAMessageFromContent(m.chat, {
                    interactiveMessage: {
                        body: {
                            text: fmt('AI ASSIST', [
                                `Status: ${isOn ? '✅ ON' : '❌ OFF'}`,
                                'Handles: create/delete/rename repos, upload files,',
                                '         list branches, create issues, star repos',
                                '',
                                'Say "clear conversation" to reset memory'
                            ])
                        },
                        footer: { text: '' },
                        nativeFlowMessage: {
                            buttons: [{
                                name: 'single_select',
                                buttonParamsJson: JSON.stringify({
                                    title: 'Toggle AI Assistant',
                                    sections: [{
                                        rows: [
                                            { title: 'ON ✅', description: 'Enable GitHub AI agent', id: `${prefix}aiassist on` },
                                            { title: 'OFF ❌', description: 'Disable GitHub AI agent', id: `${prefix}aiassist off` }
                                        ]
                                    }]
                                })
                            }]
                        }
                    }
                }, { userJid: client.user.id });
                if (_msg?.key?.id) {
                    await client.relayMessage(m.chat, _msg.message, { messageId: _msg.key.id });
                }
            }
        } catch {
            client.sendMessage(m.chat, { text: fmt('AI ASSIST', 'something broke. try again.') });
        }
    }
};
