const embed = require('../embeds/embeds');

module.exports = {
    name: 'remove',
    aliases: ['rm'],
    utilisation: '{prefix}remove',
    voiceChannel: true,

    async execute(client, message, args) {
        try {
            const queue = client.player.getQueue(message.guild.id);

            if (!queue || !queue.playing) return message.channel.send(`❌ ไม่มีเพลงที่กำลังเล่นในขณะนี้`);
            if (!queue.tracks[0]) return message.channel.send(`❌ ไม่มีเพลงอื่นในคิวให้นำออก`);

            if (!args[0]) {

                let nowplay = `กำลังเล่น : ${queue.current.title}\n\n`;
                let queueMsg = '';
                if (queue.tracks.length > 29) {
                    for (var i = 0; i <= 29; i++) {
                        queueMsg += `${i + 1}. ${queue.tracks[i].title}\n`;
                    }
                    queueMsg += `และเพลงอื่นๆอีก ${queue.tracks.length - 30} เพลง`;
                }
                else {
                    for (var i = 0; i < queue.tracks.length; i++) {
                        queueMsg += `${i + 1}. ${queue.tracks[i].title}\n`;
                    }
                }
                const instruction = `เลือกลำดับจาก **1** ถึง **${queue.tracks.length}** เพื่อ**นำออก** หรือพิมพ์อย่างอื่นเพื่อ**ยกเลิก** ⬇️`
                let loopStatus = queue.repeatMode ? (queue.repeatMode === 2 ? 'All' : 'ONE') : 'Off';
                await message.channel.send({ embeds: [embed.Embed_queue("รายการนำออก", nowplay, queueMsg, loopStatus)], content: instruction });


                const collector = message.channel.createMessageCollector({
                    time: 30000, // 30s
                    errors: ['time'],
                    filter: m => m.author.id === message.author.id
                });

                collector.on('collect', async (query) => {

                    const index = parseInt(query.content);

                    if (!index || index <= 0 || index > queue.tracks.length)
                        return message.channel.send({
                            content: `✅ ยกเลิกการนำออกแล้ว`,
                            allowedMentions: { repliedUser: false }
                        }) && collector.stop();

                    collector.stop();


                    message.channel.send('❌ '+queue.tracks[index - 1].title+' ถูกนำออกจากคิวแล้ว',{
                        //embeds: [embed.Embed_remove("Removed Music", queue.tracks[index - 1].title)],
                        allowedMentions: { repliedUser: false }
                    });
                    queue.remove(index - 1);
                    return query.react('👍');
                });

                collector.on('end', (msg, reason) => {
                    if (reason === 'time')
                        return message.channel.send(`❌ หมดเวลาการนำออกแล้ว`);
                });
            } else {
                const index = parseInt(args[0]);

                if (!index || index <= 0 || index > queue.tracks.length)
                    return message.channel.send({
                        content: `❌ ไม่พบเพลงที่ต้องการนำออก`,
                        allowedMentions: { repliedUser: false }
                    });

                message.channel.send('❌ '+queue.tracks[index - 1].title+' ถูกนำออกจากคิวแล้ว',{
                    //embeds: [embed.Embed_remove("Removed Music", queue.tracks[index - 1].title)],
                    allowedMentions: { repliedUser: false }
                });
                queue.remove(index - 1);
                return message.react('👍');
            }
        } catch (error) {
            message.channel.send('❌ เกิดข้อผิดพลาดกับคำสั่งนี้');
        }
    },
};