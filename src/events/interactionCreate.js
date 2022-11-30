const embed = require('../embeds/embeds');

module.exports = (client, int) => {
    if (!int.isButton()) return;

    const queue = client.player.getQueue(int.guildId);

    if (!queue || !queue.playing) return int.reply({ content: `❌ ไม่มีเพลงที่กำลังเล่นในขณะนี้`, ephemeral: true, components: [] });


    const track = queue.current;
    const timestamp = queue.getPlayerTimestamp();
    const trackDuration = timestamp.progress == 'Forever' ? 'Endless (Live)' : track.duration;
    let description = `ศิลปิน : **${track.author}**\nเวลา : **${trackDuration}**`;

    switch (int.customId) {
        case 'Save Song': {
            if (!queue || !queue.playing)
                return int.reply({ content: `❌ ไม่มีเพลงที่กำลังเล่นในขณะนี้`, ephemeral: true, components: [] });

            int.member.send({ embeds: [embed.Embed_save(track.title, track.url, track.thumbnail, description)] })
                .then(() => {
                    return int.reply({ content: `✅ เพลงถูกส่งไปใน DM แล้ว`, ephemeral: true, components: [] });
                }).catch(error => {
                    return int.reply({ content: `❌ ไม่สามารถส่งข้อความไปยัง DM ได้`, ephemeral: true, components: [] });
                });
        }
    }
};
