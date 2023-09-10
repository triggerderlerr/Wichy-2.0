const { URL } = require('url');
const { StringSelectMenuBuilder, ActionRowBuilder } = require("discord.js");


module.exports = {
    name: 'search',
    aliases: ['sr'],
    description: 'ค้นหาเพลงที่ต้องการเล่น',
    usage: 'search <URL/song name>',
    voiceChannel: true,
    options: [
        {
            name: "search",
            description: "ชื่อของเพลง",
            type: 3,
            required: true
        }
    ],

    async execute(client, message, args) {
        if (!args[0])
            return message.reply({ content: `❌ กรุณาใส่ชื่อเพลงที่ถูกต้อง`, allowedMentions: { repliedUser: false } });

        const userInput = args.join(' ');
        let queryType = '';

        if (isValidUrl(userInput)) queryType = client.config.urlQuery;
        else queryType = client.config.textQuery;

        const results = await client.player.search(userInput, {
            requestedBy: message.member,
            searchEngine: queryType
        })
            .catch((error) => {
                console.log(error);
                return message.reply({ content: `❌ เกิดปัญหาบางอย่างขึ้น โปรดลองอีกครั้งภายหลัง`, allowedMentions: { repliedUser: false } });
            });

        if (!results || !results.hasTracks())
            return message.reply({ content: `❌ ไม่พบผลลัพธ์`, allowedMentions: { repliedUser: false } });


        const queue = await client.player.nodes.create(message.guild, {
            metadata: {
                channel: message.channel,
                client: message.guild.members.me,
                requestedBy: message.user
            },
            selfDeaf: true,
            leaveOnEmpty: client.config.autoLeave,
            leaveOnEnd: client.config.autoLeave,
            leaveOnEmptyCooldown: client.config.autoLeaveCooldown,
            leaveOnEndCooldown: client.config.autoLeaveCooldown,
            volume: client.config.defaultVolume,
        });


        try {
            if (!queue.connection)
                await queue.connect(message.member.voice.channel);
        } catch (error) {
            console.log(error);
            if (!queue?.deleted) queue?.delete();
            return message.reply({ content: `❌ ไม่สามารถเข้าร่วมห้องสนทนาได้`, allowedMentions: { repliedUser: false } });
        }

        await message.react('👍');

        if (results.playlist || results.tracks.length == 1) {
            queue.addTrack(results.tracks);

            if (!queue.isPlaying()) {
                await queue.node.play().catch((error) => {
                    console.log(error);
                    //if (!queue?.deleted) queue?.delete();
                    return message.reply({ content: `❌ ไม่สามารถเล่นเพลงได้ โปรดลองอีกครั้งภายหลัง`, allowedMentions: { repliedUser: false } });
                });
            }

            return message.reply({ content: "✅ เพิ่มเพลงแล้ว", allowedMentions: { repliedUser: false } });
        }
        else {
            let select = new StringSelectMenuBuilder()
                .setCustomId("musicSelect")
                .setPlaceholder("เลือกเพลงที่ต้องการเล่น")
                .setOptions(results.tracks.map(x => {
                    return {
                        label: x.title.length >= 25 ? x.title.substring(0, 22) + "..." : x.title,
                        description: x.title.length >= 25 ? `[${x.duration}] ${x.title}`.substring(0, 100) : `เวลา: ${x.duration}`,
                        value: x.id
                    }
                }));
            let row = new ActionRowBuilder().addComponents(select);
            let msg = await message.reply({ components: [row] });

            const collector = msg.createMessageComponentCollector({
                time: 30000, // 30s
                filter: i => i.user.id === message.author.id
            });

            collector.on("collect", async i => {
                if (i.customId != "musicSelect") return;

                queue.addTrack(results.tracks.find(x => x.id == i.values[0]));

                if (!queue.isPlaying()) {
                    await queue.node.play().catch((error) => {
                        console.log(error);
                        //if (!queue?.deleted) queue?.delete();
                        return message.reply({ content: `❌ ไม่สามารถเล่นเพลงได้ โปรดลองอีกครั้งภายหลัง`, allowedMentions: { repliedUser: false } });
                    });
                }

                i.deferUpdate();
                return msg.edit({ content: "✅ เพิ่มเพลงแล้ว", components: [], allowedMentions: { repliedUser: false } });
            });

            collector.on("end", (collected, reason) => {
                if (reason == "time" && collected.size == 0) {
                    if (!queue?.deleted && !queue.isPlaying()) queue?.delete();
                    return msg.edit({ content: "❌ หมดเวลาในการเลือก", components: [], allowedMentions: { repliedUser: false } });
                }
            });
        }
    },

    async slashExecute(client, interaction) {
        await interaction.deferReply();

        const userInput = interaction.options.getString("search");
        let queryType = '';

        if (isValidUrl(userInput)) queryType = client.config.urlQuery;
        else queryType = client.config.textQuery;

        const results = await client.player.search(userInput, {
            requestedBy: interaction.member,
            searchEngine: queryType
        })
            .catch((error) => {
                console.log(error);
                return message.reply({ content: `❌ เกิดปัญหาบางอย่างขึ้น โปรดลองอีกครั้งภายหลัง`, allowedMentions: { repliedUser: false } });
            });

        if (!results || !results.hasTracks())
            return interaction.editReply({ content: `❌ กรุณาใส่ชื่อเพลงที่ถูกต้อง`, allowedMentions: { repliedUser: false } });


        const queue = await client.player.nodes.create(interaction.guild, {
            metadata: {
                channel: interaction.channel,
                client: interaction.guild.members.me,
                requestedBy: interaction.user
            },
            selfDeaf: true,
            leaveOnEmpty: client.config.autoLeave,
            leaveOnEnd: client.config.autoLeave,
            leaveOnEmptyCooldown: client.config.autoLeaveCooldown,
            leaveOnEndCooldown: client.config.autoLeaveCooldown,
            volume: client.config.defaultVolume,
        });

        try {
            if (!queue.connection)
                await queue.connect(interaction.member.voice.channel);
        } catch {
            await client.player.deleteQueue(interaction.guild.id);
            return interaction.editReply({ content: `❌ ไม่สามารถเข้าร่วมห้องสนทนาได้`, allowedMentions: { repliedUser: false } });
        }


        if (results.playlist || results.tracks.length == 1) {
            queue.addTrack(results.tracks);

            if (!queue.isPlaying()) {
                await queue.node.play().catch((error) => {
                    console.log(error);
                    //if (!queue?.deleted) queue?.delete();
                    return interaction.editReply({ content: `❌ ไม่สามารถเล่นเพลงได้ โปรดลองอีกครั้งภายหลัง`, allowedMentions: { repliedUser: false } });
                });
            }

            return interaction.editReply("✅ เพิ่มเพลงแล้ว");
        }
        else {
            let select = new StringSelectMenuBuilder()
                .setCustomId("musicSelect")
                .setPlaceholder("เลือกเพลงที่ต้องการเล่น")
                .setOptions(results.tracks.map(x => {
                    return {
                        label: x.title.length >= 25 ? x.title.substring(0, 22) + "..." : x.title,
                        description: x.title.length >= 25 ? `[${x.duration}] ${x.title}`.substring(0, 100) : `เวลา: ${x.duration}`,
                        value: x.id
                    }
                }));
            let row = new ActionRowBuilder().addComponents(select);
            let msg = await interaction.editReply({ components: [row] });

            const collector = msg.createMessageComponentCollector({
                time: 30000, // 30s
                filter: i => i.user.id === interaction.user.id
            });

            collector.on("collect", async i => {
                if (i.customId != "musicSelect") return;

                queue.addTrack(results.tracks.find(x => x.id == i.values[0]));

                if (!queue.isPlaying()) {
                    await queue.node.play().catch((error) => {
                        console.log(error);
                        //if (!queue?.deleted) queue?.delete();
                        return interaction.editReply({ content: `❌ ไม่สามารถเล่นเพลงได้ โปรดลองอีกครั้งภายหลัง`, allowedMentions: { repliedUser: false } });
                    });
                }

                i.deferUpdate();
                return interaction.editReply({ content: "✅ เพิ่มเพลงแล้ว", components: [] });
            });

            collector.on("end", (collected, reason) => {
                if (reason == "time" && collected.size == 0) {
                    if (!queue?.deleted && !queue.isPlaying()) queue?.delete();
                    return interaction.editReply({ content: "❌ หมดเวลาในการเลือก", components: [] });
                }
            });
        }
    },
};

const isValidUrl = (str) => {
    try {
        new URL(str);
        return true;
    } catch (err) {
        return false;
    }
}