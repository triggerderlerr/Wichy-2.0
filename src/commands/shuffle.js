module.exports = {
    name: 'shuffle',
    aliases: ['sh'],
    utilisation: '{prefix}shuffle',
    voiceChannel: true,

    execute(client, message) {
        const queue = client.player.getQueue(message.guild.id);

        if (!queue || !queue.playing) return message.channel.send('❌ ไม่มีเพลงที่กำลังเล่นในขณะนี้');

        if (!queue.tracks[0]) return message.channel.send(`❌ ไม่มีเพลงอื่นในคิว`);

        queue.shuffle();
        return message.react('🔀');

    }
};