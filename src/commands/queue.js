const embed = require('../embeds/embeds');

module.exports = {
    name: 'queue',
    aliases: ['q'],
    utilisation: '{prefix}queue',
    voiceChannel: true,

    execute(client, message) {
        try {
            const queue = client.player.getQueue(message.guild.id);

    
            if (!queue || !queue.playing) return message.channel.send(`❌ ไม่มีเพลงที่กำลังเล่นในขณะนี้`);

            if (!queue.tracks[0]) return message.channel.send(`❌ ไม่มีเพลงอื่นในคิว`);


            let nowplay = `กำลังเล่น : ${queue.current.title}\n\n`;
            let queueMsg = '';
            if (queue.tracks.length > 29) {
              for (var i = 0; i <= 29; i++) {
                queueMsg += `${i+1}. ${queue.tracks[i].title}\n`;
              }
              queueMsg += `และเพลงอื่นๆอีก ${queue.tracks.length - 30} เพลง`;
            }
            else {
              for (var i = 0; i < queue.tracks.length; i++) {
                queueMsg += `${i+1}. ${queue.tracks[i].title}\n`;
              }
            }

            let loopStatus = queue.repeatMode ? (queue.repeatMode === 2 ? 'All' : 'One') : 'Off';
            return message.channel.send({ embeds: [embed.Embed_queue("รายการเพลง", nowplay, queueMsg, loopStatus)] });
        } catch (error) {
          return message.channel.send('❌ เกิดข้อผิดพลาดกับคำสั่งนี้');
        }
    },
};