module.exports = {
    name: 'time',
    aliases: ["t"],
    description: 'ดูระยะเวลาของเพลงที่กำลังเล่น',
    usage: 'time',
    voiceChannel: true,
    options: [],

    async execute(client, message) {
        const queue = client.player.nodes.get(message.guild.id);

        if (!queue || !queue.isPlaying())
            return message.reply({ content: `❌ ไม่มีเพลงที่กำลังเล่นในขณะนี้`, allowedMentions: { repliedUser: false } });

        const progress = queue.node.createProgressBar();
        const timestamp = queue.node.getTimestamp();

        if (timestamp.progress == 'Infinity')
            return message.reply({ content: `❌ เพลงนี้เป็นการสตรีมแบบสด ไม่สามารถแสดงระยะเวลาได้`, allowedMentions: { repliedUser: false } });

        return message.reply({ content: `${progress} (**${timestamp.progress}**%)`, allowedMentions: { repliedUser: false } });
    },

    async slashExecute(client, interaction) {
        const queue = client.player.nodes.get(interaction.guild.id);

        if (!queue || !queue.isPlaying())
            return interaction.reply({ content: `❌ ไม่มีเพลงที่กำลังเล่นในขณะนี้`, allowedMentions: { repliedUser: false } });

        const progress = queue.node.createProgressBar();
        const timestamp = queue.node.getTimestamp();

        if (timestamp.progress == 'Infinity')
            return interaction.reply({ content: `❌ เพลงนี้เป็นการสตรีมแบบสด ไม่สามารถแสดงระยะเวลาได้`, allowedMentions: { repliedUser: false } });

        return interaction.reply({ content: `${progress} (**${timestamp.progress}**%)`, allowedMentions: { repliedUser: false } });
    },
};