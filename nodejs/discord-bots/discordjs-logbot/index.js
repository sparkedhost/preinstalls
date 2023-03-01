// import discord.js
const Discord = require('discord.js');
// import fs
const fs = require('fs');
// import node-fetch
const fetch = require('node-fetch');
// get the config from config.json
const config = require('./config.json');
// import http
const http = require('http');
// login to discord
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });
var dmsetting = {};
client.on('ready', () => {
    console.log('I am ready!');
    var allGuilds = client.guilds
    for (var i in allGuilds) {
        var guild = allGuilds[i];
        console.log("Ready in " + guild.name + "\n");
    }
    client.user.setActivity('messages', { type: 'LISTENING' });
});
function removeSpaces(str) {
    return str.replace(/\s/g, '');
}
function removeNonAlpha(str) {
    return str.replace(/[^a-zA-Z0-9]/g, '');
}
function getLast100Messages(channel) {
    return new Promise(function (resolve, reject) {
        channel.messages.fetch({ limit: 100 }).then(messages => {
            resolve(messages);
        }).catch(err => {
            reject(err);
        });
    });
}
client.on('messageUpdate', (oldMessage, newMessage) => {
    const tag = newMessage.author.tag;
    var date = new Date();
    fs.appendFile("./logs/" + newMessage.channel.id + '.txt', tag + ': ' + oldMessage.content + ' EDITED TO ' + newMessage.content + '\n', (err) => {
        if (err) throw err;
    });
});
function checkFileSize(file) {
    var stats = fs.statSync(file);
    var fileSizeInBytes = stats["size"];
    var fileSizeInMegabytes = fileSizeInBytes / 1000000.0;
    if (fileSizeInMegabytes > 10) {
        fs.unlink(file, (err) => {
            if (err) throw err;
        });
    }
}
function checkFileExists(file) {
    if (fs.existsSync(file)) {
        return true;
    }
    else {
        return false;
    }
}
client.on('message', message => {
    if (!checkFileExists("./logs/" + message.channel.id + '.txt')) {
        fs.writeFileSync("./logs/" + message.channel.id + ".txt", JSON.stringify("", null, 4));
    }
    checkFileSize("./logs/" + message.channel.id + '.txt');
    const tag = message.author.tag;
    var date = new Date();
    fs.appendFile("./logs/" + message.channel.id + '.txt', tag + ': ' + message.content + '\n', (err) => {
        if (err) throw err;
    });
    if(message.author.bot) return;
    var prefix = config.prefix;
    if (message.content == prefix + 'stop' && message.author.id == config.ownerid) {
        message.reply('Stopping...');
        client.destroy();
        process.exit();
    }
    if (message.content == prefix + 'download' && message.member.id == message.guild.ownerId) {
        var lines = fs.readFileSync("./logs/" + message.guild.id + '.txt').toString().split('\n').slice(-501);
        var logs = lines.join('\n');
        fetch('https://paste.sparked.host/documents', {
            method: 'POST',
            body: logs
        }).then(res => res.json()).then(json => {
            message.channel.send('https://paste.sparked.host/' + json.key);
        });
    }
    if (message.content == prefix + 'dump' && message.author.id == config.ownerid) {
        var lines = fs.readFileSync("./logs/" + message.guild.id + '.txt').toString().split('\n').slice(-101);
        var logs = lines.join('\n');
        fetch('https://paste.sparked.host/documents', {
            method: 'POST',
            body: logs
        }).then(res => res.json()).then(json => {
            message.author.send('https://paste.sparked.host/' + json.key);
        });
    }
    if (message.content == prefix + 'downloadall' && message.member.id == message.guild.ownerId) {
        var lines = fs.readFileSync("./logs/" + message.guild.id + '.txt').toString().split('\n');
        var logs = lines.join('\n');
        fetch('https://paste.sparked.host/documents', {
            method: 'POST',
            body: logs
        }).then(res => res.json()).then(json => {
            message.channel.send('https://paste.sparked.host/' + json.key);
        });
    }
    if (message.content == prefix + 'help') {
        message.channel.send('```' + prefix + 'download - download the last 100 lines of the log\n' + prefix + 'downloadall - download the entire log\n' + prefix + 'help - display this message\n' + prefix + 'deletelogs - delete all logs```');
    }
    if (message.content == prefix + 'deletelogs' && message.author.id == message.guild.ownerId) {
        fs.unlink("./logs/" + message.channel.id + '.txt', (err) => {
            if (err) throw err;
        });
        message.channel.send('Deleted logs.');
    }
    if (message.content.includes('<@' + client.user.id + '>')) {
        message.channel.send('Heyo, ' + message.author.username + '! I am ' + client.tag +', a bot made by <@' + config.ownerid + '> to help you keep track of your server\'s messages.\nUse ' + prefix + 'help to see what I can do.');
    }
});

client.login(config.token);
