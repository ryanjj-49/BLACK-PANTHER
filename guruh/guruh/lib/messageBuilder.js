export function buildMsg(title, lines = [], footer = '✪ 𝐁𝐋𝐀𝐂𝐊 𝐏𝐀𝐍𝐓𝐇𝐄𝐑 ┃ ᴹᴰ ✪') {
    const body = lines.map(l => `▢ ${l}`).join('\n');
    return `✦ ──『 ${title} 』── ⚝\n${body}\n└──✪ 𝐁𝐋𝐀𝐂𝐊 𝐏𝐀𝐍𝐓𝐇𝐄𝐑 ┃ ᴹᴰ ✪──\n> ${footer}`;
}

export function buildLine(msg, footer = '✪ 𝐁𝐋𝐀𝐂𝐊 𝐏𝐀𝐍𝐓𝐇𝐄𝐑 ┃ ᴹᴰ ✪') {
    return `▢ ${msg}\n└──✪ 𝐁𝐋𝐀𝐂𝐊 𝐏𝐀𝐍𝐓𝐇𝐄𝐑 ┃ ᴹᴰ ✪──\n> ${footer}`;
}

export function buildError(title, err, footer = '✪ 𝐁𝐋𝐀𝐂𝐊 𝐏𝐀𝐍𝐓𝐇𝐄𝐑 ┃ ᴹᴰ ✪') {
    const msg = err instanceof Error ? err.message : String(err);
    return `✦ ──『 ${title} ERROR 』── ⚝\n▢ ${msg}\n└──✪ 𝐁𝐋𝐀𝐂𝐊 𝐏𝐀𝐍𝐓𝐇𝐄𝐑 ┃ ᴹᴰ ✪──\n> ${footer}`;
}

export function buildList(title, items = [], footer = '✪ 𝐁𝐋𝐀𝐂𝐊 𝐏𝐀𝐍𝐓𝐇𝐄𝐑 ┃ ᴹᴰ ✪') {
    const body = items.map((item, i) => `▢ ${i + 1}. ${item}`).join('\n');
    return `✦ ──『 ${title} 』── ⚝\n${body}\n└──✪ 𝐁𝐋𝐀𝐂𝐊 𝐏𝐀𝐍𝐓𝐇𝐄𝐑 ┃ ᴹᴰ ✪──\n> ${footer}`;
}

export function buildField(title, fields = {}, footer = '✪ 𝐁𝐋𝐀𝐂𝐊 𝐏𝐀𝐍𝐓𝐇𝐄𝐑 ┃ ᴹᴰ ✪') {
    const body = Object.entries(fields).map(([k, v]) => `▢ ${k}: ${v}`).join('\n');
    return `✦ ──『 ${title} 』── ⚝\n${body}\n└──✪ 𝐁𝐋𝐀𝐂𝐊 𝐏𝐀𝐍𝐓𝐇𝐄𝐑 ┃ ᴹᴰ ✪──\n> ${footer}`;
}

export function buildUsage(cmd, usage, example, footer = '✪ 𝐁𝐋𝐀𝐂𝐊 𝐏𝐀𝐍𝐓𝐇𝐄𝐑 ┃ ᴹᴰ ✪') {
    return `✦ ──『 ${cmd.toUpperCase()} 』── ⚝\n▢ Usage: ${usage}\n▢ Example: ${example}\n└──✪ 𝐁𝐋𝐀𝐂𝐊 𝐏𝐀𝐍𝐓𝐇𝐄𝐑 ┃ ᴹᴰ ✪──\n> ${footer}`;
}
