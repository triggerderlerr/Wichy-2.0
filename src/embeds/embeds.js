const dotenv = require('dotenv');
const Discord = require('discord.js');

dotenv.config();
const ENV = process.env;

const github = 'https://github.com/hmes98318/Music-Disc';
const bot_version = require('../../package.json').version;

const bot_name = typeof (process.env.BOT_NAME) === 'undefined' ? 'Music Disc' : (ENV.BOT_NAME);
const color = typeof (process.env.EMBEDS_COLOR) === 'undefined' ? '#FFFFFF' : (ENV.EMBEDS_COLOR);


module.exports = {
    Embed_dashboard: function (status, music_title, music_url, music_thumbnail, music_description) {
        const Embed_dashboard = new Discord.EmbedBuilder()
            .setColor(color)
            .setTitle(music_title)
            .setURL(music_url)
            .setThumbnail(music_thumbnail)
            .addFields({ name: status, value: music_description })
            .setTimestamp()
        return Embed_dashboard;
    },

    Embed_add: function (status, music_title, music_url, music_thumbnail, music_author, music_length) {
        const Embed_add = new Discord.EmbedBuilder()
            .setColor(color)
            .setTitle(music_title)
            .setURL(music_url)
            .setThumbnail(music_thumbnail)
            .addFields({ name: status, value: `ศิลปิน  : **${music_author}**\nเวลา **${music_length}**`, inline: true })
            .setTimestamp()
        return Embed_add;
    },

    Embed_queue: function (status, nowplay, queueMsg, loopStatus) {
        const Embed_queue = new Discord.EmbedBuilder()
            .setColor(color)
            .setTitle(status)
            .addFields({ name: nowplay, value: queueMsg })
            .setTimestamp()
            .setFooter({ text: `วนซ้ำ: ${loopStatus}` });
        return Embed_queue;
    },

    Embed_remove: function (status, music_title) {
        const Embed_remove = new Discord.EmbedBuilder()
            .setColor(color)
            .setTitle(status)
            .setDescription(`${music_title}`)
            .setTimestamp()
        return Embed_remove;
    },

    Embed_save: function (music_title, music_url, music_thumbnail, description) {
        const Embed_queue = new Discord.EmbedBuilder()
            .setColor(color)
            .setTitle(music_title)
            .setURL(music_url)
            .setThumbnail(music_thumbnail)
            .setDescription(description)
            .setTimestamp()
        return Embed_queue;
    },

    Embed_search: function (music_title, description) {
        const Embed_cantFindSong = new Discord.EmbedBuilder()
            .setColor(color)
            .setTitle(music_title)
            .setDescription(description)
            .setTimestamp()
        return Embed_cantFindSong;
    },

    Embed_help: function (help_title, help_thumbnail, description) {
        const Embed_help = new Discord.EmbedBuilder()
            .setColor(color)
            .setTitle(help_title)
            .setURL(github)
            .setThumbnail(help_thumbnail)
            .setDescription(description)
            .setTimestamp()
        return Embed_help;
    },

    Embed_help2: function (command, description) {
        const Embed_help2 = new Discord.EmbedBuilder()
            .setColor(color)
            .setTitle(`คำสั่ง **${command}**`, '')
            .setDescription(description)
        return Embed_help2;
    },

    Embed_status: function (uptime, os, node_v, djs_v, cpu, cpu_usage, ram, heap, ping, serverCount) {
        const Embed_status = new Discord.EmbedBuilder()
            .setColor(color)
            .setTitle(`${bot_name} v${bot_version}`)
            .setURL(github)
            .setDescription(`**• Serving ${serverCount} servers**\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
            .addFields(
                { name: `⚙️ SYSTEM`, value: `OS : **${os}**\nNode.js : **${node_v}**\nDiscord.js : **${djs_v}**\nCPU : **${cpu}**\nUptime : **${uptime}**\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━`, inline: false },
                { name: `📊 USAGE`, value: `CPU : **${cpu_usage}**\nRam : **${ram}**\nHeap : **${heap}**\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━`, inline: false },
                { name: `🛰️ LATENCY`, value: `Bot : **${ping.bot}**\nAPI : **${ping.api}ms**`, inline: false }
            )
            .setTimestamp()
        return Embed_status;
    },

    Embed_server: function (serverlist) {
        const Embed_server = new Discord.EmbedBuilder()
            .setColor(color)
            .setTitle(`เซิร์ฟเวอร์ที่มีบอท **${bot_name}**`, '')
            .setDescription(serverlist)
        return Embed_server;
    },

    Embed_ping: function (bot, api) {
        const Embed_ping = new Discord.EmbedBuilder()
            .setColor(color)
            .setTitle('🛰️ ความหน่วงต่อเซิฟเวอร์')
            .setDescription(`บอท : **${bot}**\nAPI : **${api}ms**`)
        return Embed_ping;
    },

    Embed_connect: function () {
        const Embed_connect = new Discord.EmbedBuilder()
            .setColor(color)
            .setDescription('✅ เชื่อมต่อห้องสนทนาแล้ว')
        return Embed_connect;
    },

    Embed_disconnect: function () {
        const Embed_disconnect = new Discord.EmbedBuilder()
            .setColor(color)
            .setDescription('เล่นเพลงเสร็จแล้ว')
        return Embed_disconnect;
    },

    Embed_lyrics: function (lyrics_title, lyrics_description) {
        const Embed_lyrics = new Discord.EmbedBuilder()
            .setColor(color)
            .setTitle(`เนื้อเพลงของ **${lyrics_title}**`)
            .setDescription(lyrics_description)
            .setTimestamp()
        return Embed_lyrics;
    }
}
