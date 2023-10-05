module.exports = {
    name: 'stop',
    aliases: ['leave'],
    description: 'หยุดเพลงและออกจากห้องสนทนา',
    usage: 'stop',
    voiceChannel: true,
    options: [],

    execute(client, message) {
        const queue = client.player.nodes.get(message.guild.id);

        if (!queue || !queue.isPlaying())
            return message.reply({ content: `❌ ไม่มีเพลงที่กำลังเล่นในขณะนี้`, allowedMentions: { repliedUser: false } });

        if (!queue.deleted)
            queue.delete();

        return message.react('👍');
    },

    slashExecute(client, interaction) {
        const queue = client.player.nodes.get(interaction.guild.id);

        if (!queue || !queue.isPlaying())
            return interaction.reply({ content: `❌ ไม่มีเพลงที่กำลังเล่นในขณะนี้`, allowedMentions: { repliedUser: false } });

        if (!queue.deleted)
            queue.delete();

        return interaction.reply('✅ บอทออกจากห้องสนทนาแล้ว');
    },
};