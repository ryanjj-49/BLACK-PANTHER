'use strict';
// ─────────────────────────────────────────────────────────────────
//  MENU REPLY TRIGGER
//  Fires when a user sends a digit (1-10) within 90s of .menu
//  Builds the category listing inline from getAllCmds() — no
//  delegation to individual *menu plugins (which crash on bad paths).
// ─────────────────────────────────────────────────────────────────
const { addTrigger, getAllCmds } = require('../../guru/handlers/loader');
const { getMenuState, clearMenuState } = require('../lib/menuState.cjs');

// Maps digit → { label, emoji, category (matches loader dir.toLowerCase()) }
const CATEGORIES = {
    1:  { label: 'General',   emoji: '📜', category: 'general'   },
    2:  { label: 'Settings',  emoji: '🛠️',  category: 'settings'  },
    3:  { label: 'Owner',     emoji: '👑', category: 'owner'     },
    4:  { label: 'Group',     emoji: '👥', category: 'groups'    },
    5:  { label: 'AI',        emoji: '🧠', category: 'ai'        },
    6:  { label: 'Downloads', emoji: '🎬', category: 'downloads' },
    7:  { label: 'Editing',   emoji: '✂️',  category: 'editing'   },
    8:  { label: 'Effects',   emoji: '🎨', category: 'effects'   },
    9:  { label: 'Utils',     emoji: '🔧', category: 'utils'     },
    10: { label: 'Privacy',   emoji: '🔒', category: 'privacy'   },
};

function buildCategoryText(num, prefix) {
    const { label, emoji, category } = CATEGORIES[num];
    const cmds = getAllCmds().filter(c => c.category === category);

    if (!cmds.length) {
        return `✦ ──『 ${emoji} ${label} 』── ⚝\n▢ No commands found in this category yet.\n└──✪ 𝐁𝐋𝐀𝐂𝐊 𝐏𝐀𝐍𝐓𝐇𝐄𝐑 ┃ ᴹᴰ ✪──`;
    }

    const lines = cmds.map(c => {
        const desc = c.desc ? ` — ${c.desc}` : '';
        return `▢ *${prefix}${c.name}*${desc}`;
    });

    return [
        `✦ ──『 ${emoji} ${label} Menu 』── ⚝`,
        ...lines,
        `└──✪ 𝐁𝐋𝐀𝐂𝐊 𝐏𝐀𝐍𝐓𝐇𝐄𝐑 ┃ ᴹᴰ ✪──`,
    ].join('\n');
}

addTrigger({
    pattern: /^(10|[1-9])$/,
    handler: async (ctx) => {
        try {
            const { m, from, sock, config: cfg } = ctx;
            const body = (m.body || '').trim();
            const num  = parseInt(body, 10);
            if (!num || num < 1 || num > 10) return;

            const state = getMenuState(from);
            if (!state) return;

            // Accept if quoting the exact menu message, OR within 90-second window
            const quotedId     = m.quotedKey?.id;
            const isQuotingMenu = quotedId && state.messageId && quotedId === state.messageId;
            const isWithinWindow = (Date.now() - state.timestamp) < 90_000;

            if (!isQuotingMenu && !isWithinWindow) return;

            clearMenuState(from);

            const prefix = cfg?.BOT_PREFIX || '.';
            const text   = buildCategoryText(num, prefix);

            await sock.sendMessage(from, { text });
        } catch (e) {
            // Never let the trigger crash the message handler
        }
    },
});
