module.exports = {
    name: 'jump',
    aliases: ['j'],
    description: `นำเพลงที่เลือกขึ้นมาเล่น`,
    usage: 'jump <ลำดับคิว>',
    voiceChannel: true,
    options: [
        {
            name: "number",
            description: "ลำดับคิวที่ต้องการนำมาเล่น",
            type: 4,
            required: true,
            min_value: 1
        }
    ],

    async execute(client, message, args) {
        const queue = client.player.nodes.get(message.guild.id);
        const tracks = queue.tracks.map((track, index) => `${++index}. ${track.title}`);

        if (!queue || !queue.isPlaying())
            return message.reply({ content: `❌ ไม่มีเพลงที่กำลังเล่นในขณะนี้`, allowedMentions: { repliedUser: false } });

        if (!args[0])
            return message.reply({ content: `❌ กรุณาป้อนลำดับของเพลงที่ต้องการเล่น ระหว่าง 1 ถึง ${tracks.length}`, allowedMentions: { repliedUser: false }});

        if (args[0] > tracks.length || args[0] < 1 || isNaN(args[0]))
            return message.reply({ content: `❌ กรุณาป้อนลำดับเพลงที่ถูกต้อง ระหว่าง 1 ถึง ${tracks.length}`, allowedMentions: { repliedUser: false }});

        const jumpLength = parseInt(args[0]) - 1;

        if (queue.repeatMode === 1) {
            queue.setRepeatMode(0);
            queue.node.jump(jumpLength);
            await wait(500);
            queue.setRepeatMode(1);
        } else {
            queue.node.jump(jumpLength);
        }

        return message.react('⏭️');
    },

    async slashExecute(client, interaction) {
        const queue = client.player.nodes.get(interaction.guild.id);
        const tracks = queue.tracks.map((track, index) => `${++index}. ${track.title}`);
        const index_number = interaction.options.getInteger('number');

        if (!queue || !queue.isPlaying())
            return interaction.reply({ content: `❌ ไม่มีเพลงที่กำลังเล่นในขณะนี้`, allowedMentions: { repliedUser: false } });

        if (!index_number)
            return interaction.reply({ content: `❌ กรุณาป้อนลำดับของเพลงที่ต้องการเล่น ระหว่าง 1 ถึง ${tracks.length}`, allowedMentions: { repliedUser: false }});

        if (index_number > queue.length || index_number < 1 || isNaN(index_number))
            return interaction.reply({ content: `❌ กรุณาป้อนลำดับเพลงที่ถูกต้อง ระหว่าง 1 ถึง ${tracks.length}`, allowedMentions: { repliedUser: false }});

        const jumpLength = parseInt(index_number) - 1;

        if (queue.repeatMode === 1) {
            queue.setRepeatMode(0);
            queue.node.jump(jumpLength);
            await wait(500);
            queue.setRepeatMode(1);
        } else {
            queue.node.jump(jumpLength);
        }

        return interaction.reply({ content: `⏭️ นำเพลงลำดับที่ ${index_number} ขึ้นมาเล่นแล้ว`, allowedMentions: { repliedUser: false }});
    },
};