const embed = require('../embeds/embeds');


module.exports = {
    name: 'server',
    aliases: [],
    showHelp: false,
    description: 'แสดงเซิร์ฟเวอร์ทั้งหมดที่มีบอทอยู่',
    usage: 'server',
    options: [],

    execute(client, message) {
        let serverlist = '';
        serverlist = client.guilds.cache
            .map(g => `**${g.name}** (${g.id})`) //g.id, g.name, g.memberCount available
            .join('\n');

        return message.reply({ content: `❌ ไม่สามารถดูได้เนื่องจากเป็นการละเมิดความเป็นส่วนตัวของผู้ใช้`, allowedMentions: { repliedUser: false }});
        //return message.reply({ embeds: [embed.Embed_server(serverlist)], allowedMentions: { repliedUser: false } });
    },

    slashExecute(client, interaction) {
        let serverlist = '';
        serverlist = client.guilds.cache
            .map(g => `**${g.name}** (${g.id})`)
            .join('\n');

        return interaction.reply({ content: `❌ ไม่สามารถดูได้เนื่องจากเป็นการละเมิดความเป็นส่วนตัวของผู้ใช้`, allowedMentions: { repliedUser: false }});
        //return interaction.reply({ embeds: [embed.Embed_server(serverlist)], allowedMentions: { repliedUser: false } });
    },
};