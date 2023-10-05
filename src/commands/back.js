module.exports = {
    name: 'back',
    aliases: ['b', 'rewind'],
    description: 'กลับไปเล่นเพลงก่อนหน้านี้',
    usage: 'back',
    voiceChannel: true,
    options: [],

    async execute(client, message) {
        const queue = client.player.nodes.get(message.guild.id);

        if (!queue || !queue.isPlaying())
            return message.reply({ content: `❌ ไม่มีเพลงที่กำลังเล่นในขณะนี้`, allowedMentions: { repliedUser: false } });

        if (!queue.history.previousTrack)
            return message.reply({ content: `❌ ไม่มีเพลงที่เล่นก่อนหน้านี้`, allowedMentions: { repliedUser: false } });

        await queue.history.back();
        return await message.react('👍');
    },

    async slashExecute(client, interaction) {
        const queue = client.player.nodes.get(interaction.guild.id);

        if (!queue || !queue.isPlaying())
            return interaction.reply({ content: `❌ ไม่มีเพลงที่กำลังเล่นในขณะนี้`, allowedMentions: { repliedUser: false } });

        if (!queue.history.previousTrack)
            return interaction.reply({ content: `❌ ไม่มีเพลงที่เล่นก่อนหน้านี้`, allowedMentions: { repliedUser: false } });

        await queue.history.back();
        return await interaction.reply("✅ กลับไปเล่นเพลงก่อนหน้าแล้ว");
    },
};