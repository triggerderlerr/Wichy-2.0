module.exports = {
    name: 'skipto',
    aliases: ['st'],
    utilisation: '{prefix}skipto [queue]',
    voiceChannel: true,

    async execute(client, message, args) {
        const queue = client.player.getQueue(message.guild.id);

        if (!queue || !queue.playing)
            return message.channel.send(`❌ ไม่มีเพลงที่กำลังเล่นในขณะนี้`);

        if (!args[0])
            return message.channel.send(`❌ กรุณาป้อนลำดับของคิวที่ต้องการข้ามไป ระหว่าง 1 ถึง ${queue.tracks.length}`);

        if (args[0] > queue.tracks.length || args[0] < 1 || isNaN(args[0]))
            return message.channel.send(`❌ กรุณาป้อนลำดับคิวที่ถูกต้อง ระหว่าง 1 ถึง ${queue.tracks.length}`);

        const skipLength = parseInt(args[0]) - 1;

        if (queue.repeatMode === 1) {
            queue.setRepeatMode(0);
            queue.skipTo(skipLength);
            await wait(500);
            queue.setRepeatMode(1);
        } else {
            queue.skipTo(skipLength);
        }

        return message.react('⏭️');
    },
};




function wait(ms) {
    return new Promise((resolve) => setTimeout(() => resolve(), ms));
};