import { sendInteractive } from '../../lib/sendInteractive.js';
export default {
  name: 'spotify',
  aliases: ['spotifydl', 'spoti', 'spt'],
  description: 'Downloads songs from Spotify',
  run: async (context) => {
    const { client, m, text } = context;
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

    try {
      const query = (text || '').trim();
      if (!query) {
          await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
          return sendInteractive(client, m, "╭━⬣ 「 SPOTIFY 』── ⚝\n┃ Give me a song name, you tone-deaf cretin.\n╰━━━━━━━━━━━━━━━\n");
      }

      if (query.length > 100) {
          await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
          return sendInteractive(client, m, "╭━⬣ 「 SPOTIFY 』── ⚝\n┃ Song title longer than my patience. 100 chars MAX!\n╰━━━━━━━━━━━━━━━\n");
      }

      await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

      const response = await fetch(`https://api.ootaizumi.web.id/downloader/spotifyplay?query=${encodeURIComponent(query)}`);
      const data = await response.json();

      if (!data.status || !data.result?.download) {
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
        return sendInteractive(client, m, `┃ No song found for "${query}".\n┃ Your music taste is as bad as your search skills.\n╰━━━━━━━━━━━━━━━\n`);
      }

      const song = data.result;
      const audioUrl = song.download;
      const filename = song.title || "Unknown Song";
      const artist = song.artists || "Unknown Artist";

      await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });

      await client.sendMessage(m.chat, {
        audio: { url: audioUrl },
        mimetype: "audio/mpeg",
        fileName: `${filename}.mp3`,
        contextInfo: {
          externalAdReply: {
            title: filename.substring(0, 30),
            body: artist.substring(0, 30),
            thumbnailUrl: song.image || "",
            sourceUrl: song.external_url || "",
            mediaType: 1,
            renderLargerThumbnail: true } } });

      await client.sendMessage(m.chat, {
        document: { url: audioUrl },
        mimetype: "audio/mpeg",
        fileName: `${filename.replace(/[<>:"/\\|?*]/g, '_')}.mp3`,
        caption: `╭━⬣ 「 SPOTIFY 』── ⚝
┃ ${filename} - ${artist}\n╰━━━━━━━━━━━━━━━\n`
      });

    } catch (error) {
      console.error('Spotify error:', error);
      await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
      await sendInteractive(client, m, `╭━⬣ 「 SPOTIFY ERROR 』── ⚝
┃ Download failed. Universe rejects your music taste.\n┃ ${error.message}\n╰━━━━━━━━━━━━━━━\n`);
    }
  }
};
