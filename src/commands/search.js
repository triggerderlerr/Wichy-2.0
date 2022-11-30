const { QueryType } = require('discord-player');
let { SelectMenuBuilder, ActionRowBuilder } = require("discord.js");

module.exports = {
    name: 'search',
    aliases: ['sr'],
    utilisation: '{prefix}search [song name]',
    voiceChannel: true,

    async execute(client, message, args) {

        if (!args[0]) return message.channel.send(`❌ กรุณาใส่ชื่อเพลงที่ถูกต้อง`);

        const res = await client.player.search(args.join(' '), {
            requestedBy: message.member,
            searchEngine: QueryType.AUTO
        });

        if (!res || !res.tracks.length) return message.channel.send(`❌ ไม่พบผลลัพธ์`);

        const queue = await client.player.createQueue(message.guild, {
            metadata: message.channel,
            leaveOnEnd: client.config.autoLeave,
            leaveOnStop: client.config.autoLeave,
            leaveOnEmpty: client.config.autoLeave,
            initialVolume: client.config.defaultVolume,
            ytdlOptions: client.config.ytdlOptions
        });

        try {
            if (!queue.connection)
                await queue.connect(message.member.voice.channel);
        } catch {
            await client.player.deleteQueue(message.guild.id);
            return message.channel.send(`❌ ไม่สามารถเข้าร่วมห้องสนทนาได้`);
        }

        await message.react('👍');

        if (res.playlist || res.tracks.length == 1) {
            queue.addTracks(res.tracks);

            if (!queue.playing)
                await queue.play();

            return message.channel.send("✅ เพิ่มเพลงแล้ว");
        }
        else {
            let select = new SelectMenuBuilder()
                .setCustomId("musicSelect")
                .setPlaceholder("เลือกเพลงที่ต้องการ")
                .setOptions(res.tracks.map(x => {
                    return {
                        label: x.title.length >= 25 ? x.title.substring(0, 22) + "..." : x.title,
                        description: x.title.length >= 25 ? `${x.title} [${x.duration}]`.substring(0, 100) : `เวลา: ${x.duration}`,
                        value: x.id
                    }
                }))
            let row = new ActionRowBuilder().addComponents(select);
            let msg = await message.channel.send({ components: [row] });

            const collector = msg.createMessageComponentCollector({
                time: 20000, // 20s
                filter: i => i.user.id === message.author.id
            });

            collector.on("collect", async i => {
                if (i.customId != "musicSelect") return;

                queue.addTrack(res.tracks.find(x => x.id == i.values[0]));

                if (!queue.playing)
                    await queue.play();

                i.deferUpdate();
                return msg.edit({ content: "✅ เพิ่มเพลงแล้ว", components: [] });
            });

            collector.on("end", (collected, reason) => {
                if (reason == "time" && collected.size == 0) {
                    if ((!queue.current || !queue.playing) && queue.connection) queue.destroy();
                    return msg.edit({ content: "❌ หมดเวลาในการเลือก", components: [] });
                }
            });
        }
    },
};