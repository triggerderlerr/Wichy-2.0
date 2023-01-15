const { QueryType } = require('discord-player');

function wait(ms) {
    return new Promise((resolve) => setTimeout(() => resolve(), ms));
}

module.exports = {
    name: 'play',
    aliases: ['p'],
    utilisation: '{prefix}play [song name/URL]',
    voiceChannel: true,

    async execute(client, message, args) {

        function checkLastArgs(text) {
            if (args[args.length - 1] === text.toString()) {
                return true;
            } else {
                return false;
            }
        }

        try {
            if (!args[0])
                return message.channel.send(`❌ พิมพ์ชื่อเพลงที่คุณต้องการหาหรือวาง URL ของเพลงที่ต้องการเปิด`);
            
            if (checkLastArgs('--debug')) {
                res = await client.player.search(args.slice(0,-1).join(' '), {
                    requestedBy: message.member,
                    searchEngine: QueryType.AUTO
                });
            } else {
                res = await client.player.search(args.join(' '), {
                    requestedBy: message.member,
                    searchEngine: QueryType.AUTO
                });
            }

            if (!res || !res.tracks.length)
                return message.channel.send(`❌ ไม่พบผลลัพธ์`);

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

            try {
                await res.playlist ? queue.addTracks(res.tracks) : queue.addTrack(res.tracks[0]);
            } catch (error) {
                await client.player.deleteQueue(message.guild.id);
                throw error;
            }

            if (!queue.playing) {
                await queue.play();
                mode = null;
                await wait(queue.tracks.length * 50); //wait for queue to be filled (the time depends on the number of tracks)

                //retry to play if queue is empty
                if (queue.tracks.length > 60 && !queue.playing) {
                    await queue.play();
                }
            }
        } catch (error) {
            message.channel.send(`❌ เกิดข้อผิดพลาดกับคำสั่ง`);

            if (checkLastArgs('--debug'))
                message.channel.send(`📄 Debug Info: \`\`\`${error.stack}\`\`\``);

            return
        }
    },
};