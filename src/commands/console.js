function wait(ms) {
    return new Promise((resolve) => setTimeout(() => resolve(), ms));
}

module.exports = {
    name: 'console',
    aliases: ['cmd'],
    utilisation: '{prefix}console [cmd]',


    async execute(client, message, args) {

        const queue = await client.player.createQueue(message.guild, {
            metadata: message.channel,
            leaveOnEnd: client.config.autoLeave,
            leaveOnStop: client.config.autoLeave,
            leaveOnEmpty: client.config.autoLeave,
            initialVolume: client.config.defaultVolume,
            ytdlOptions: client.config.ytdlOptions
        });

        if (!args[0]) {
            return message.channel.send('❌ Usage: ;console [cmd]')
        }

        try {
            if (args[0] === 'terminate') {
                if (args[1] === '-s') {
                    message.channel.send("Terminated batch with 'success'.");
                    await wait(500);
                    return process.exit(0);
                }
                if (args[1] === '-f') {
                    message.channel.send("Terminated batch with 'failure'.");
                    await wait(500);
                    return process.exit(1);
                }
            }

            if (args[0] === 'queue') {
                if (args[1] === 'play') {
                    try {
                        if (!queue.playing) {
                            await queue.play();
                            return message.channel.send('Played queue.');
                        } else {
                            return message.channel.send('Queue is currently playing.')
                        }
                    } catch (error) {
                        return message.channel.send('Cannot play queue.');
                    }
                }
                if (args[1] === 'destroy') {
                    try {
                        await queue.destroy();
                        return message.channel.send('Destroyed queue.');
                    } catch (error) {
                        return message.channel.send('Cannot destroy queue.');
                    }
                }
                if (args[1] === 'show'){
                    try {
                        let queueMsg = '';
                        if (queue.tracks.length > 29) {
                            for (var i = 0; i <= 29; i++) {
                            queueMsg += `${i+1}. ${queue.tracks[i].title}\n`;
                            }
                            queueMsg += `And ${queue.tracks.length - 30} other songs.`;
                        }
                        else {
                            for (var i = 0; i < queue.tracks.length; i++) {
                            queueMsg += `${i+1}. ${queue.tracks[i].title}\n`;
                            }
                        }
                        
                        return message.channel.send(queueMsg);
                    } catch (error) {
                        return message.channel.send('Cannot get queue list.');
                    }
                }
                if (args[1] === 'track') {
                    if (args[2] === 'skip') {
                        try {
                            await queue.skip();
                            return message.channel.send('Skipped track.');
                        } catch (error) {
                            return message.channel.send('Cannot skip track.')
                        }
                    }
                    if (args[2] === 'skipto') {
                        try {
                            await queue.skipTo(args[3] - 1);
                            return message.channel.send(`Skipped ${args[3]} tracks.`);
                        } catch (error) {
                            return message.channel.send('Cannot skip tracks.');
                        }
                    }
                    if (args[2] === 'jump') {
                        try {
                            await queue.jump(args[3] - 1);
                            return message.channel.send(`Jumped to track ${args[3]}.`);
                        } catch (error) {
                            return message.channel.send('Cannot jump to track.');
                        }
                    }
                }
            }

            else {
                throw error;
            }

        } catch (error) {
            return message.channel.send('There is a syntax error or it is not recognized as a command.');
        }
    },
};