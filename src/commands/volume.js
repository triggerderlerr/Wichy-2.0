module.exports = {
    name: 'volume',
    aliases: ['v'],
    utilisation: `{prefix}volume [number]`,
    voiceChannel: true,

    async execute(client, message, args) {
        const maxVolume = client.config.maxVolume;
        const queue = client.player.getQueue(message.guild.id);

        if (!queue || !queue.playing)
            return message.channel.send(`❌ ไม่มีเพลงที่กำลังเล่นในขณะนี้`);

        await message.react('👍');
        const vol = parseInt(args[0]);

        if (!vol)
            return message.channel.send(`ระดับเสียงปัจจุบัน: **${queue.volume}** 🔊\n**พิมพ์ตัวเลขระหว่าง \`1\` ถึง \`${maxVolume}\` เพื่อเปลี่ยนระดับเสียง**`);

        if (queue.volume === vol)
            return message.channel.send(`❌ ระดับเสียงที่ต้องการเปลี่ยนคือระดับเสียงปัจจุบัน`);

        if (vol < 0 || vol > maxVolume)
            return message.channel.send(`❌ **พิมพ์ตัวเลขระหว่าง \`1\` ถึง \`${maxVolume}\` เพื่อเปลี่ยนระดับเสียง**`);

        const success = queue.setVolume(vol);

        return message.channel.send(success ? `ปรับระดับเสียงเป็น 🔊 **${vol}**/**${maxVolume}**%` : `❌ มีบางอย่างผิดพลาด`);
    },
};