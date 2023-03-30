module.exports = {
    name: 'skip',
    aliases: ['s'],
    description: 'ข้ามเพลงปัจจุบัน',
    usage: 'skip',
    voiceChannel: true,
    options: [
        {
            name: "number",
            description: "ลำดับของเพลงที่ต้องการข้ามไป",
            type: 4,
            required: false
        }
    ],

    async execute(client, message, args) {
        const queue = client.player.nodes.get(message.guild.id);
        const tracks = queue.tracks.map((track, index) => `${++index}. ${track.title}`);

        if (!queue || !queue.isPlaying())
            return message.reply({ content: `❌ ไม่มีเพลงที่กำลังเล่นในขณะนี้`, allowedMentions: { repliedUser: false } });

        if (!args[0] || args[0] === '1') {
            if (queue.repeatMode === 1) {
                queue.setRepeatMode(0);
                queue.node.skip();
                await wait(500);
                queue.setRepeatMode(1);
            }
            else {
                queue.node.skip();
            }
        }
        
        else {
            skipLength = parseInt(args[0]);

            if (!skipLength || skipLength < 1 || skipLength > tracks.length) {
                return message.reply({ content: `❌ ไม่มีเพลงที่ต้องการข้ามไปหรือตัวเลขไม่ถูกต้อง`, allowedMentions: { repliedUser: false } });
            } 
            else {
                if (queue.repeatMode === 1) {
                    queue.setRepeatMode(0);
                    queue.node.skipTo(skipLength - 1);
                    await wait(500);
                    queue.setRepeatMode(1);
                }
                else {
                    queue.node.skipTo(skipLength - 1);
                }
            }
        }

        return message.react('👍');
    },

    async slashExecute(client, interaction) {
        const queue = client.player.nodes.get(interaction.guild.id);
        const tracks = queue.tracks.map((track, index) => `${++index}. ${track.title}`);
        const number = interaction.options.getInteger('number');

        if (!queue || !queue.isPlaying())
            return interaction.reply({ content: `❌ ไม่มีเพลงที่กำลังเล่นในขณะนี้`, allowedMentions: { repliedUser: false } });

        if (!number || number === 1) {
            if (queue.repeatMode === 1) {
                queue.setRepeatMode(0);
                queue.node.skip();
                await wait(500);
                queue.setRepeatMode(1);
            }
            else {
                queue.node.skip();
            }
            return interaction.reply('✅ ข้ามเพลงปัจจุบันแล้ว');
        }

        else {
            if (!number || number < 1 || number > tracks.length) {
                return interaction.reply({ content: `❌ ไม่มีเพลงที่ต้องการข้ามไปหรือตัวเลขไม่ถูกต้อง`, allowedMentions: { repliedUser: false } });
            } 
            else {
                if (queue.repeatMode === 1) {
                    queue.setRepeatMode(0);
                    queue.node.skipTo(number - 1);
                    await wait(500);
                    queue.setRepeatMode(1);
                }
                else {
                    queue.node.skipTo(number - 1);
                }
                return interaction.reply(`✅ ข้ามไปยังเพลงที่ ${number} แล้ว`);
            }
        }
    },
};




const wait = (ms) => {
    return new Promise((resolve) => setTimeout(() => resolve(), ms));
};