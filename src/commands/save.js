const embed = require('../embeds/embeds');

module.exports = {
    name: 'save',
    aliases: ['sv'],
    utilisation: '{prefix}save',
    voiceChannel: true,

    async execute(client, message) {
        const queue = client.player.getQueue(message.guild.id);

        const timestamp = queue.getPlayerTimestamp();
        const trackDuration = timestamp.progress == 'Forever' ? 'Endless (Live)' : queue.current.duration;
        let description = `ศิลปิน : **${queue.current.author}**\nเวลา : **${trackDuration}**`;

        if (!queue || !queue.playing)
            return message.channel.send(`❌ ไม่มีเพลงที่กำลังเล่นในขณะนี้`);


        message.author.send({ embeds: [embed.Embed_save(queue.current.title, queue.current.url, queue.current.thumbnail, description)] })
            //message.author.send(`Registered track: **${queue.current.title}** | ${queue.current.author}, Saved server: **${message.guild.name}** ✅`)
            .then(() => {
                message.react('👍');
            }).catch(e => {
                console.log(e);
                message.react('❌');
            });
    },
};