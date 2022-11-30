module.exports = {
    name: 'pause',
    aliases: ['pa'],
    utilisation: '{prefix}pause',
    voiceChannel: true,

    execute(client, message) {
        const queue = client.player.getQueue(message.guild.id);

        if (!queue || !queue.playing)
            return message.channel.send(`❌ ไม่มีเพลงที่กำลังเล่นในขณะนี้`);

        const success = queue.setPaused(true);

        return success ? message.react('⏸️') : message.channel.send(`❌ มีบางอย่างผิดพลาด`);
    },
};