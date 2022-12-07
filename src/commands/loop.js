const prefix = require('../../config.json').prefix;

module.exports = {
    name: 'loop',
    aliases: ['l'],
    utilisation: '{prefix}loop [mode]',
    voiceChannel: true,

    execute(client, message, args) {
        
        const queue = client.player.getQueue(message.guild.id);

        if (!queue || !queue.playing) {
            mode = null;
            return message.channel.send(`❌ ไม่มีเพลงที่กำลังเล่นในขณะนี้`);
        }

        if (typeof mode === 'undefined') {
            mode = null;
        }

        const methods = ['Off', 'Single', 'All'];

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
                default:
                    return message.channel.send(`❌ การใช้งานโหมดแบบกำหนดเอง ${prefix}loop [all/one/off]`);
                    break;
            }
        } catch (error) {
            if (!args[0]) {
                if (mode == 1 || mode == 2) {
                    mode = 0;
                } else {
                    mode = 2;
                }
                //return message.channel.send(`❌ | ${prefix}loop [all/one/off]`);
            }
        }

        queue.setRepeatMode(mode);

        message.react('👍');
        return message.channel.send(`เปลี่ยนโหมดวนซ้ำเป็น \`${methods[mode]}\``);
        
    }
}
