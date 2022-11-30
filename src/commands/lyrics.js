const embed = require('../embeds/embeds');
const lyricsFinder = require('lyrics-finder');


module.exports = {
    name: 'lyrics',
    aliases: ['ly'],
    utilisation: '{prefix}lyrics [song name/URL]',
    voiceChannel: true,

    async execute(client, message, args) {
        const queue = client.player.getQueue(message.guild.id);

        if (!args[0]) {
            if (!queue || !queue.playing) 
                return message.channel.send('❌ ไม่มีเพลงที่กำลังเล่นในขณะนี้');
            
            try {
                const lyrics = await lyricsFinder(queue.current.title, '');
                if (lyrics.trim().length === 0) {
                    throw error;
                }
                return message.channel.send({ embeds: [embed.Embed_lyrics(queue.current.title, lyrics)] });
            } catch (error) {
                return message.channel.send('❌ ไม่พบเนื้อเพลง');
            }
        }

        try {
            const lyrics = await lyricsFinder(args, '');
            if (lyrics.trim().length === 0) {
                throw error;
            }
            Title = args.join(' ');
            return message.channel.send({ embeds: [embed.Embed_lyrics(Title, lyrics)] });
        } catch (error) {
            return message.channel.send('❌ ไม่พบเนื้อเพลง');
        }
    }
};