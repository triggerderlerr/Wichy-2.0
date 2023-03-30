module.exports = {
    name: 'resume',
    aliases: ['re'],
    description: 'เล่นเพลงที่หยุดชั่วคราวต่อ',
    usage: 'resume',
    voiceChannel: true,
    options: [],

    execute(client, message) {
        const queue = client.player.nodes.get(message.guild.id);

        if (!queue)
            return message.reply({ content: `❌ ไม่มีเพลงที่กำลังเล่นในขณะนี้`, allowedMentions: { repliedUser: false } });

        const success = queue.node.resume();
        return success ? message.react('▶️') : message.reply({ content: `❌ มีบางอย่างผิดพลาด`, allowedMentions: { repliedUser: false } });
    },

    slashExecute(client, interaction) {
        const queue = client.player.nodes.get(interaction.guild.id);

        if (!queue)
            return interaction.reply({ content: `❌ ไม่มีเพลงที่กำลังเล่นในขณะนี้`, allowedMentions: { repliedUser: false } });

        const success = queue.node.resume();
        return success ? interaction.reply("▶️ เล่นเพลงต่อแล้ว") : interaction.reply({ content: `❌ มีบางอย่างผิดพลาด`, allowedMentions: { repliedUser: false } });
    },
};