'use strict';

const fs = require('fs');

const dotenv = require('dotenv');
const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const { Player } = require('discord-player');
const express = require('express');


dotenv.config();
const ENV = process.env;


let client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
    ],
    partials: [Partials.Channel],
    disableMentions: 'everyone',
});


client.config = {
    name: 'Music Disc',
    prefix: '-',
    playing: '+help | music',
    defaultVolume: 50,
    maxVolume: 100,
    autoLeave: true,
    autoLeaveCooldown: 5000,
    displayVoiceState: true,
    port: 33333
};

client.commands = new Collection();
client.player = new Player(client, {
    ytdlOptions: {
        filter: 'audioonly',
        quality: 'highestaudio',
        highWaterMark: 1 << 27
    }
});

const player = client.player;
const color = {
    white: '\x1B[0m',
    grey: '\x1B[2m',
    green: '\x1B[32m'
};

client.login(ENV.TOKEN).catch(err => {
    console.log('Invalid token provided');
    process.exit(1);
});

client.on('ready', () => {
    client.user.setPresence({ activities: [{ name: 'Under Maintenance' }], status: 'dnd' });
    client.user.setStatus('dnd');
    console.log(`Logged in as ${client.user.username} in Maintenance Mode`);
});


//Error Handling (Catch unexpected errors and send to your DM)
function sendErrorToDM(error, error_type) {
    try {client.users.cache.get(ENV.ADMIN_ID).send(`**[Maintenance Mode] Unexpected Error Detected** ❌ \`(${error_type})\` \`\`\`${error.stack}\`\`\``);} catch {}
}


process.on('uncaughtException', err => {
    console.log('Uncaught Exception:', err.stack);
    sendErrorToDM(err, 'Uncaught Exception');
});
  
process.on('unhandledRejection', reason => {
    if (reason != "DiscordAPIError[50007]: Cannot send messages to this user") {
        console.log('Unhandled Rejection:', reason.stack);
        sendErrorToDM(reason, 'Unhandled Rejection');
    } else {
        console.log('CANNOT SEND MESSAGES TO USER');
        console.log('Unhandled Rejection:', reason.stack);
    }
});