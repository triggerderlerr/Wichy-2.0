const embed = require('../embeds/embeds');


module.exports = {
    name: 'queue',
    aliases: ['q'],
    description: 'แสดงคิวที่กำลังเล่นอยู่',
    usage: 'queue',
    voiceChannel: true,
    options: [],

    execute(client, message) {
        const queue = client.player.nodes.get(message.guild.id);

        if (!queue || !queue.currentTrack)
            return message.reply({ content: `❌ ไม่มีเพลงที่กำลังเล่นในขณะนี้`, allowedMentions: { repliedUser: false } });


        const tracks = queue.tracks.map((track, index) => `${++index}. ${track.title}`);

        let nowplaying = `กำลังเล่น : ${queue.currentTrack.title}\n\n`;
        let tracksQueue = '';

        if (tracks.length < 1) {
            tracksQueue = '------------------------------';
        }
        else if (tracks.length > 29) {
            tracksQueue = tracks.slice(0, 30).join('\n');
            tracksQueue += `\nและเพลงอื่นๆอีก ${tracks.length - 30} เพลง`;
        }
        else {
            tracksQueue = tracks.join('\n');
        }

        let loopStatus = queue.repeatMode ? (queue.repeatMode === 2 ? 'All' : 'One') : 'Off';
        return message.reply({ embeds: [embed.Embed_queue("รายการเพลง", nowplaying, tracksQueue, loopStatus)], allowedMentions: { repliedUser: false } });
    },

    slashExecute(client, interaction) {
        const queue = client.player.nodes.get(interaction.guild.id);

        if (!queue || !queue.currentTrack)
            return interaction.reply({ content: `❌ ไม่มีเพลงที่กำลังเล่นในขณะนี้`, allowedMentions: { repliedUser: false } });


        const tracks = queue.tracks.map((track, index) => `${++index}. ${track.title}`);

        let nowplaying = `กำลังเล่น : ${queue.currentTrack.title}\n\n`;
        let tracksQueue = '';

        if (tracks.length < 1) {
            tracksQueue = '------------------------------';
        }
        else if (tracks.length > 29) {
            tracksQueue = tracks.slice(0, 30).join('\n');
            tracksQueue += `\nและเพลงอื่นๆอีก ${tracks.length - 30} เพลง`;
        }
        else {
            tracksQueue = tracks.join('\n');
        }

        let loopStatus = queue.repeatMode ? (queue.repeatMode === 2 ? 'All' : 'One') : 'Off';
        return interaction.reply({ embeds: [embed.Embed_queue("รายการเพลง", nowplaying, tracksQueue, loopStatus)] });
    },
};