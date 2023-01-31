const { QueryType } = require('discord-player');
const RandomSong = require('@chatandshare/random-song');
const random = new RandomSong('7f47dd89ef61e23baebb59e009be88e3');

function wait(ms) {
    return new Promise((resolve) => setTimeout(() => resolve(), ms));
}

module.exports = {
    name: 'random',
    aliases: ['rd'],
    utilisation: '{prefix}random',
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
            randomedSong = await random.song();

            res = await client.player.search(randomedSong.track_name + randomedSong.artist_name, {
                requestedBy: message.member,
                searchEngine: QueryType.AUTO
            });

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
            }
            
        } catch (error) {
            message.channel.send(`❌ เกิดข้อผิดพลาดกับคำสั่ง`);

            if (checkLastArgs('--debug')) {
                message.channel.send(`📄 Debug Info: \`\`\`${error.stack}\`\`\``);
            }

            return
        }
    },
};