const embed = require('../embeds/embeds');


module.exports = {
    name: 'remove',
    aliases: ['rm'],
    description: 'นำเพลงออกจากคิว',
    usage: 'remove <song index number>',
    voiceChannel: true,
    options: [
        {
            name: "number",
            description: "ลำดับของเพลงในคิว",
            type: 4,
            required: false
        }
    ],

    async execute(client, message, args) {
        const queue = client.player.nodes.get(message.guild.id);

        if (!queue || !queue.isPlaying())
            return message.reply({ content: `❌ ไม่มีเพลงที่กำลังเล่นในขณะนี้`, allowedMentions: { repliedUser: false } });


        const tracks = queue.tracks.map((track, index) => `${++index}. ${track.title}`);

        if (tracks.length < 1)
            return message.reply({ content: `❌ ไม่มีเพลงอื่นในคิวให้นำออก`, allowedMentions: { repliedUser: false } });

        if (!args[0]) {
            let nowplaying = `กำลังเล่น : ${queue.currentTrack.title}\n\n`;
            let tracksQueue = '';

            if (tracks.length > 29) {
                tracksQueue = tracks.slice(0, 30).join('\n');
                tracksQueue += `\nและเพลงอื่นๆอีก ${tracks.length - 30} เพลง`;
            }
            else {
                tracksQueue = tracks.join('\n');
            }

            const instruction = `เลือกลำดับจาก **1** ถึง **${tracks.length}** เพื่อ**นำออก** หรือพิมพ์อย่างอื่นเพื่อ**ยกเลิก** ⬇️`;
            let loopStatus = queue.repeatMode ? (queue.repeatMode === 2 ? 'All' : 'ONE') : 'Off';
            await message.reply({ content: instruction, embeds: [embed.Embed_queue("รายการนำออก", nowplaying, tracksQueue, loopStatus)], allowedMentions: { repliedUser: false } });


            const collector = message.channel.createMessageCollector({
                time: 30000, // 30s
                errors: ['time'],
                filter: m => m.author.id === message.author.id
            });

            collector.on('collect', async (query) => {

                const index = parseInt(query.content);

                if (!index || index <= 0 || index > tracks.length) {
                    return message.reply({ content: `✅ ยกเลิกการนำออกแล้ว`, allowedMentions: { repliedUser: false } })
                        && collector.stop();
                }

                collector.stop();
                await queue.node.remove(index - 1);

                query.reply({ content: `❌ ${tracks[index - 1]} ถูกนำออกจากคิวแล้ว`, allowedMentions: { repliedUser: false }});
                //query.reply({ embeds: [embed.Embed_remove("Removed Music", tracks[index - 1])], allowedMentions: { repliedUser: false } });
                return query.react('👍');
            });

            collector.on('end', (msg, reason) => {
                if (reason === 'time')
                    return message.reply({ content: `❌ หมดเวลาการนำออกแล้ว`, allowedMentions: { repliedUser: false } });
            });
        } else {
            const index = parseInt(args[0]);

            if (!index || index <= 0 || index > tracks.length) {
                return message.reply({ content: `❌ ไม่มีเพลงที่ต้องการนำออกในคิวหรือตัวเลขไม่ถูกต้อง`, allowedMentions: { repliedUser: false } });
            }

            await queue.node.remove(index - 1);
            message.reply({ content: `❌ ${tracks[index - 1]} ถูกนำออกจากคิวแล้ว`, allowedMentions: { repliedUser: false } });
            //return message.reply({ embeds: [embed.Embed_remove("Removed Music", tracks[index - 1])], allowedMentions: { repliedUser: false } });
            return message.react('👍');
        }
    },

    async slashExecute(client, interaction) {
        const queue = client.player.nodes.get(interaction.guild.id);
        const number = interaction.options.getInteger('number');

        if (!queue || !queue.isPlaying())
            return interaction.reply({ content: `❌ ไม่มีเพลงที่กำลังเล่นในขณะนี้`, allowedMentions: { repliedUser: false } });


        const tracks = queue.tracks.map((track, index) => `${++index}. ${track.title}`);

        if (tracks.length < 1)
            return interaction.reply({ content: `❌ ไม่มีเพลงอื่นในคิวให้นำออก`, allowedMentions: { repliedUser: false } });

        if (!number) {
            let nowplaying = `กำลังเล่น : ${queue.currentTrack.title}\n\n`;
            let tracksQueue = '';

            if (tracks.length > 29) {
                tracksQueue = tracks.slice(0, 30).join('\n');
                tracksQueue += `\nและเพลงอื่นๆอีก ${tracks.length - 30} เพลง`;
            }
            else {
                tracksQueue = tracks.join('\n');
            }

            const instruction = `เลือกลำดับจาก **1** ถึง **${tracks.length}** เพื่อ**นำออก** หรือพิมพ์อย่างอื่นเพื่อ**ยกเลิก** ⬇️`;
            let loopStatus = queue.repeatMode ? (queue.repeatMode === 2 ? 'All' : 'ONE') : 'Off';
            await interaction.reply({ content: instruction, embeds: [embed.Embed_queue("รายการนำออก", nowplaying, tracksQueue, loopStatus)], allowedMentions: { repliedUser: false } });


            const collector = interaction.channel.createMessageCollector({
                time: 30000, // 30s
                errors: ['time'],
                filter: m => m.author.id === interaction.user.id
            });

            collector.on('collect', async (query) => {
                const index = parseInt(query.content);

                if (!index || index <= 0 || index > tracks.length) {
                    return query.reply({ content: `✅ ยกเลิกการนำออกแล้ว`, allowedMentions: { repliedUser: false } })
                        && collector.stop();
                }

                collector.stop();
                await queue.node.remove(index - 1);

                query.reply({ content: `❌ ${tracks[index - 1]} ถูกนำออกจากคิวแล้ว`, allowedMentions: { repliedUser: false }})
                //query.reply({ embeds: [embed.Embed_remove("Removed Music", tracks[index - 1])], allowedMentions: { repliedUser: false } });
                return query.react('👍');
            });

            collector.on('end', (msg, reason) => {
                if (reason === 'time')
                    return interaction.reply({ content: `❌ หมดเวลาการนำออกแล้ว`, allowedMentions: { repliedUser: false } });
            });
        } else {

            if (!number || number <= 0 || number > tracks.length) {
                return interaction.reply({ content: `❌ ไม่มีเพลงที่ต้องการนำออกในคิวหรือตัวเลขไม่ถูกต้อง`, allowedMentions: { repliedUser: false } });
            }

            await queue.node.remove(number - 1);
            return interaction.reply({ content: `❌ ${tracks[number - 1]} ถูกนำออกจากคิวแล้ว`, allowedMentions: { repliedUser: false } });
            //return interaction.reply({ embeds: [embed.Embed_remove("Removed Music", tracks[number - 1])], allowedMentions: { repliedUser: false } });
        }
    },
};