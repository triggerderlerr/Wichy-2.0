const embed = require('../embeds/embeds');


module.exports = (client, int) => {

    if (int.isButton()) {
        const queue = client.player.nodes.get(int.guildId);

        if (!queue || !queue.isPlaying())
            return int.reply({ content: `❌ ไม่มีเพลงที่กำลังเล่นในขณะนี้`, ephemeral: true, components: [] });


        const track = queue.currentTrack;
        const timestamp = queue.node.getTimestamp();
        const trackDuration = timestamp.progress == 'Forever' ? 'Endless (Live)' : track.duration;
        let description = `ศิลปิน : **${track.author}**\nเวลา : **${trackDuration}**`;


        switch (int.customId) {
            case 'Save Song': {

                if (!queue || !queue.isPlaying())
                    return int.reply({ content: `❌ ไม่มีเพลงที่กำลังเล่นในขณะนี้`, ephemeral: true, components: [] });


                int.member.send({ embeds: [embed.Embed_save(track.title, track.url, track.thumbnail, description)] })
                    .then(() => {
                        return int.reply({ content: `✅ เพลงถูกส่งไปยังข้อความส่วนตัวแล้ว`, ephemeral: true, components: [] });
                    })
                    .catch(error => {
                        console.log('error: ' + error);
                        return int.reply({ content: `❌ ไม่สามารถส่งข้อความไปยังข้อความส่วนตัวได้`, ephemeral: true, components: [] });
                    });
            } break;
        }
    }
    else {
        if (!int.isCommand() || !int.inGuild() || int.member.user.bot) return;


        const cmd = client.commands.get(int.commandName);
        if (cmd) {
            console.log(`(\x1B[2m${int.member.guild.name}\x1B[0m) ${int.user.username} : /${int.commandName}`);
            cmd.slashExecute(client, int);
        }
    }
};
