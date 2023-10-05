module.exports = {
    name: 'loop',
    aliases: ['l'],
    description: 'เปลี่ยนโหมดการเล่นซ้ำของเพลง',
    usage: 'loop <all/one/off>',
    voiceChannel: true,
    options: [
        {
            name: "mode",
            description: "โหมดการเล่นซ้ำ",
            type: 3,
            required: false,
            choices: [
                {
                    name: "Off",
                    value: "off"
                },
                {
                    name: "All",
                    value: "all"
                },
                {
                    name: "One",
                    value: "one"
                },
                {
                    name: "Autoplay",
                    value: "ap"
                }
            ]
        }
    ],

    execute(client, message, args) {
        const queue = client.player.nodes.get(message.guild.id);
        const prefix = client.config.prefix;

        if (!queue || !queue.isPlaying()) {
            return message.reply({ content: `❌ ไม่มีเพลงที่กำลังเล่นในขณะนี้`, allowedMentions: { repliedUser: false } });
        }

        mode = typeof queue.repeatMode == 'undefined' ? 0 : queue.repeatMode;

        const methods = ['Off', 'Single', 'All', 'Autoplay'];

        try {
            switch (args[0].toLowerCase()) {
                case 'off':
                    mode = 0;
                    break;
                case 'one' || 'single':
                    mode = 1;
                    break;
                case 'all' || 'queue':
                    mode = 2;
                    break;
                case 'ap' || 'autoplay':
                    mode = 3;
                    break;
                default:
                    return message.reply({ content: `❌ การใช้งานโหมดแบบกำหนดเอง ${prefix}loop <all/one/off>`, allowedMentions: { repliedUser: false } });
            }
        } catch (error) {
            if (!args[0]) {
                if (mode == 1 || mode == 2 || mode == 3)
                    mode = 0;
                else
                    mode = 2;
                //return message.reply({ content: `❌ | ${prefix}loop <all/one/off>`, allowedMentions: { repliedUser: false } });
            }
        }

        queue.setRepeatMode(mode);

        message.react('👍');
        return message.reply({ content: `เปลี่ยนโหมดวนซ้ำเป็น \`${methods[mode]}\``, allowedMentions: { repliedUser: false } });
    },

    slashExecute(client, interaction) {
        const queue = client.player.nodes.get(interaction.guild.id);
        const mode_input = interaction.options.getString('mode');

        if (!queue || !queue.isPlaying())
            return interaction.reply({ content: `❌ ไม่มีเพลงที่กำลังเล่นในขณะนี้`, allowedMentions: { repliedUser: false } });

        mode = typeof queue.repeatMode == 'undefined' ? 0 : queue.repeatMode;

        const methods = {
            off: 0,
            one: 1,
            all: 2,
            ap: 3
        }
        const names = {
            off: "Off",
            one: "Single",
            all: "All",
            ap: "Autoplay"
        }

        if (!mode_input) {
            if (mode == 1 || mode == 2 || mode == 3)
                mode = 0;
            else
                mode = 2;
        }

        else {
            mode = methods[mode_input];
        }

        queue.setRepeatMode(mode);

        return interaction.reply({ content: `เปลี่ยนโหมดวนซ้ำเป็น \`${!mode_input ? ['Off', 'Single', 'All'][mode] : names[mode_input]}\``, allowedMentions: { repliedUser: false } });
    },
};