module.exports = {
    name: 'volume',
    aliases: ['v'],
    description: `เปลี่ยนระดับเสียงของคิวปัจจุบัน`,
    usage: 'volume <0-200>',
    voiceChannel: true,
    options: [
        {
            name: "volume",
            description: "ระดับเสียง (0-200)",
            type: 4,
            required: true,
            min_value: 0
        }
    ],

    async execute(client, message, args) {
        const maxVolume = client.config.maxVolume;
        const queue = client.player.nodes.get(message.guild.id);

        if (!queue || !queue.isPlaying())
            return message.reply({ content: `❌ ไม่มีเพลงที่กำลังเล่นในขณะนี้`, allowedMentions: { repliedUser: false } });


        await message.react('👍');
        const vol = parseInt(args[0], 10);

        if (!vol)
            return message.reply({ content: `ระดับเสียงปัจจุบัน: **${queue.node.volume}** 🔊\n**พิมพ์ตัวเลขระหว่าง \`1\` ถึง \`${maxVolume}\` เพื่อเปลี่ยนระดับเสียง**`, allowedMentions: { repliedUser: false } });

        if (queue.volume === vol)
            return message.reply({ content: `❌ ระดับเสียงที่ต้องการเปลี่ยนคือระดับเสียงปัจจุบัน`, allowedMentions: { repliedUser: false } });

        if (vol < 0 || vol > maxVolume)
            return message.reply({ content: `❌ **พิมพ์ตัวเลขระหว่าง \`1\` ถึง \`${maxVolume}\` เพื่อเปลี่ยนระดับเสียง**`, allowedMentions: { repliedUser: false } });


        const success = queue.node.setVolume(vol);
        const replymsg = success ? `ปรับระดับเสียงเป็น 🔊 **${vol}**/**${maxVolume}**%` : `❌ มีบางอย่างผิดพลาด`;
        return message.reply({ content: replymsg, allowedMentions: { repliedUser: false } });
    },

    async slashExecute(client, interaction) {
        const maxVolume = client.config.maxVolume;
        const queue = client.player.nodes.get(interaction.guild.id);

        if (!queue || !queue.isPlaying())
            return interaction.reply({ content: `❌ ไม่มีเพลงที่กำลังเล่นในขณะนี้`, allowedMentions: { repliedUser: false } });

        const vol = parseInt(interaction.options.getInteger("volume"), 10);

        if (!vol)
            return interaction.reply({ content: `ระดับเสียงปัจจุบัน: **${queue.node.volume}** 🔊\n**พิมพ์ตัวเลขระหว่าง \`1\` ถึง \`${maxVolume}\` เพื่อเปลี่ยนระดับเสียง**`, allowedMentions: { repliedUser: false } });

        if (queue.volume === vol)
            return interaction.reply({ content: `❌ ระดับเสียงที่ต้องการเปลี่ยนคือระดับเสียงปัจจุบัน`, allowedMentions: { repliedUser: false } });

        if (vol < 0 || vol > maxVolume)
            return interaction.reply({ content: `❌ **พิมพ์ตัวเลขระหว่าง \`1\` ถึง \`${maxVolume}\` เพื่อเปลี่ยนระดับเสียง**`, allowedMentions: { repliedUser: false } });


        const success = queue.node.setVolume(vol);
        const replymsg = success ? `ปรับระดับเสียงเป็น 🔊 **${vol}**/**${maxVolume}**%` : `❌ มีบางอย่างผิดพลาด`;
        return interaction.reply({ content: replymsg, allowedMentions: { repliedUser: false } });
    },
};