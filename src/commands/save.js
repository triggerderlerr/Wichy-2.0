const embed = require('../embeds/embeds');


module.exports = {
    name: 'save',
    aliases: [],
    description: 'บันทึกเพลงที่กำลังเล่นอยู่ในข้อความส่วนตัว',
    usage: 'save',
    voiceChannel: true,
    options: [],

    async execute(client, message) {
        const queue = client.player.nodes.get(message.guild.id);

        if (!queue || !queue.isPlaying())
            return message.reply({ content: `❌ ไม่มีเพลงที่กำลังเล่นในขณะนี้`, allowedMentions: { repliedUser: false } });


        const track = queue.currentTrack;
        const timestamp = queue.node.getTimestamp();
        const trackDuration = timestamp.progress == 'Forever' ? 'Endless (Live)' : track.duration;
        let description = `ศิลปิน : **${track.author}**\nเวลา : **${trackDuration}**`;

        message.author.send({ embeds: [embed.Embed_save(track.title, track.url, track.thumbnail, description)] })
            //message.author.send(`Registered track: **${track.title}** | ${track.author}, Saved server: **${message.guild.name}** ✅`)
            .then(() => {
                message.react('👍');
            })
            .catch(error => {
                console.log('error: ' + error);
                message.react('❌');
            });
    },

    async slashExecute(client, interaction) {
        const queue = client.player.nodes.get(interaction.guild.id);

        if (!queue || !queue.isPlaying())
            return interaction.reply({ content: `❌ ไม่มีเพลงที่กำลังเล่นในขณะนี้`, allowedMentions: { repliedUser: false } });


        const track = queue.currentTrack;
        const timestamp = queue.node.getTimestamp();
        const trackDuration = timestamp.progress == 'Forever' ? 'Endless (Live)' : track.duration;
        let description = `ศิลปิน : **${track.author}**\nเวลา : **${trackDuration}**`;

        interaction.user.send({ embeds: [embed.Embed_save(track.title, track.url, track.thumbnail, description)] })
            .then(() => {
                interaction.reply("✅ เพลงถูกส่งไปยังข้อความส่วนตัวแล้ว")
            })
            .catch(error => {
                console.log('error: ' + error);
                interaction.reply("❌ ไม่สามารถส่งข้อความไปยังข้อความส่วนตัวได้")
            });
    },
};