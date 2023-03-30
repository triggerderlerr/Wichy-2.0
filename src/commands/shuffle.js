module.exports = {
    name: 'shuffle',
    aliases: ['sh'],
    description: 'จัดเรียงเพลงในคิวแบบสุ่ม',
    usage: 'shuffle',
    voiceChannel: true,
    options: [],

    async execute(client, message) {
        const queue = client.player.nodes.get(message.guild.id);

        if (!queue || !queue.isPlaying())
            return message.reply({ content: `❌ ไม่มีเพลงที่กำลังเล่นในขณะนี้`, allowedMentions: { repliedUser: false } });

        queue.tracks.shuffle();
        return message.react('👍');
    },

    slashExecute(client, interaction) {
        const queue = client.player.nodes.get(interaction.guild.id);

        if (!queue || !queue.isPlaying())
            return interaction.reply({ content: `❌ ไม่มีเพลงที่กำลังเล่นในขณะนี้`, allowedMentions: { repliedUser: false } });

        queue.tracks.shuffle();
        return interaction.reply('✅ จัดเรียงเพลงในคิวแบบสุ่มแล้ว');
    },
};