module.exports = {
    name: 'pause',
    aliases: ['pa'],
    description: 'หยุดเพลงชั่วคราว',
    usage: 'pause',
    voiceChannel: true,
    options: [],

    execute(client, message) {
        const queue = client.player.nodes.get(message.guild.id);

        if (!queue || !queue.isPlaying())
            return message.reply({ content: `❌ ไม่มีเพลงที่กำลังเล่นในขณะนี้`, allowedMentions: { repliedUser: false } });

        const success = queue.node.pause();
        return success ? message.react('⏸️') : message.reply({ content: `❌ มีบางอย่างผิดพลาด`, allowedMentions: { repliedUser: false } });
    },

    slashExecute(client, interaction) {
        const queue = client.player.nodes.get(interaction.guild.id);

        if (!queue || !queue.isPlaying())
            return interaction.reply({ content: `❌ ไม่มีเพลงที่กำลังเล่นในขณะนี้`, allowedMentions: { repliedUser: false } });

        const success = queue.node.pause();
        return success ? interaction.reply("⏸️ หยุดเพลงชั่วคราวแล้ว") : interaction.reply({ content: `❌ มีบางอย่างผิดพลาด`, allowedMentions: { repliedUser: false } });
    },
};