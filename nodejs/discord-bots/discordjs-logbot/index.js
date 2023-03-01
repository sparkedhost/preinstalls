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
// display success after logging in
client.on('ready', () => {
    console.log('I am ready!');
    var allGuilds = client.guilds
    // for every guild the bot is in, log the guild name to the console
    for (var i in allGuilds) {
        var guild = allGuilds[i];
        console.log("Ready in " + guild.name + "\n");
    }
    // set the bots game to be listening to messages
    client.user.setActivity('messages', { type: 'LISTENING' });
});
// a function to remove spaces from a string
function removeSpaces(str) {
    return str.replace(/\s/g, '');
}
// a function to remove all non-alphanumeric characters from a string
function removeNonAlpha(str) {
    return str.replace(/[^a-zA-Z0-9]/g, '');
}
// a function to get the last 100 messages from a channel
function getLast100Messages(channel) {
    return new Promise(function (resolve, reject) {
        channel.messages.fetch({ limit: 100 }).then(messages => {
            resolve(messages);
        }).catch(err => {
            reject(err);
        });
    });
}
// on any edit to a message, log the message to the console
client.on('messageUpdate', (oldMessage, newMessage) => {
    // get user tag
    const tag = newMessage.author.tag;
    // make a date variable
    var date = new Date();
    // send date to the console
    // get the servers id
    var serverid = newMessage.guild.id;
    // if the message is not from the bot, add the message to messages.txt
    fs.appendFile("./logs/" + newMessage.channel.id + '.txt', tag + ': ' + oldMessage.content + ' EDITED TO ' + newMessage.content + '\n', (err) => {
        if (err) throw err;
    });
});
// check if a file is over 10 mb, if it is, delete it
function checkFileSize(file) {
    // get the file size
    var stats = fs.statSync(file);
    // get the file size in bytes
    var fileSizeInBytes = stats["size"];
    // convert the file size to megabytes
    var fileSizeInMegabytes = fileSizeInBytes / 1000000.0;
    // if the file is over 10 mb, delete it
    if (fileSizeInMegabytes > 10) {
        fs.unlink(file, (err) => {
            if (err) throw err;
        });
    }
}
// check if file exists
function checkFileExists(file) {
    // if the file exists, return true
    if (fs.existsSync(file)) {
        return true;
    }
    // if the file does not exist, return false
    else {
        return false;
    }
}
// display message when someone sends a message
client.on('message', message => {
    // if file does not exist
    if (!checkFileExists("./logs/" + message.channel.id + '.txt')) {
        fs.writeFileSync("./logs/" + message.channel.id + ".txt", JSON.stringify("", null, 4));
    }
    checkFileSize("./logs/" + message.channel.id + '.txt');
    // get user tag
    const tag = message.author.tag;
    // make a date variable
    var date = new Date();
    // send date to the console
    // get the servers id
    var serverid = message.channel.id;
    // if the message is not from the bot, add the message to messages.txt
    fs.appendFile("./logs/" + serverid + '.txt', tag + ': ' + message.content + '\n', (err) => {
        if (err) throw err;
    });
    if(message.author.bot) return;
    // set the prefix to the prefix in config.json
    var prefix = config.prefix;
    // if the message is "stop" and the message authors id is 545636523580850186 then stop the bot
    if (message.content == prefix + 'stop' && message.author.id == config.ownerid) {
        message.reply('Stopping...');
        client.destroy();
        process.exit();
    }
    // if the message is prefix + "download", send ./logs/guildname.txt to hastebin
    if (message.content == prefix + 'download' && message.member.id == message.guild.ownerId) {
        // store the last 100 lines of the file
        var lines = fs.readFileSync("./logs/" + message.guild.id + '.txt').toString().split('\n').slice(-501);
        // replace every "ॐ" with a newline
        var logs = lines.join('\n');
        // send the archive to hastebin
        fetch('http://132.145.29.171:1035/documents', {
            method: 'POST',
            body: logs
        }).then(res => res.json()).then(json => {
            // send the hastebin link to the channel
            message.channel.send('http://132.145.29.171:1035/' + json.key);
        });
    }
    // if the message is prefix + "dump" and the message authors id is config.ownerid, send ./logs/message.guild.id.txt to the message author
    if (message.content == prefix + 'dump' && message.author.id == config.ownerid) {
        // send the file to hastebin
        // store the last 100 lines of the file
        var lines = fs.readFileSync("./logs/" + message.guild.id + '.txt').toString().split('\n').slice(-101);
        // replace every "ॐ" with a newline
        var logs = lines.join('\n');
        // send the archive to hastebin
        fetch('http://132.145.29.171:1035/documents', {
            method: 'POST',
            body: logs
        }).then(res => res.json()).then(json => {
            // send the hastebin link to the message author
            message.author.send('http://132.145.29.171:1035/' + json.key);
        });
    }
    // if the message is prefix + "downloadall", send ./logs/guildname.txt to hastebin
    if (message.content == prefix + 'downloadall' && message.member.id == message.guild.ownerId) {
        // store the last 100 lines of the file
        var lines = fs.readFileSync("./logs/" + message.guild.id + '.txt').toString().split('\n');
        // readd new lines
        var logs = lines.join('\n');
        // send the archive to hastebin
        fetch('http://132.145.29.171:1035/documents', {
            method: 'POST',
            body: logs
        }).then(res => res.json()).then(json => {
            // send the hastebin link to the channel
            message.channel.send('http://132.145.29.171:1035/' + json.key);
        });
    }
    // if the message is prefix + "help", send a help message to the channel
    if (message.content == prefix + 'help') {
        message.channel.send('```' + prefix + 'download - download the last 100 lines of the log\n' + prefix + 'downloadall - download the entire log\n' + prefix + 'help - display this message\n' + prefix + 'deletelogs - delete all logs```');
    }
    // if message is prefix + "deletelogs", delete the logs file
    if (message.content == prefix + 'deletelogs' && message.author.id == message.guild.ownerId) {
        // get the servers id
        var serverid = message.guild.id;
        // delete the logs file
        fs.unlink("./logs/" + serverid + '.txt', (err) => {
            if (err) throw err;
        });
        // send a message to the channel
        message.channel.send('Deleted logs.');
    }
    // if bot is mentioned, send a message to the channel
    if (message.content.includes('<@' + client.user.id + '>')) {
        message.channel.send('Heyo, ' + message.author.username + '! I am ' + client.tag +', a bot made by <@' + config.ownerid + '> to help you keep track of your server\'s messages.\nUse ' + prefix + 'help to see what I can do.');
    }
});

http.createServer(function (req, res) {
    // if the request is for the index page, send the index page
    if (req.url == '/') {
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });
        res.write('<h1>403 Forbidden</h1>');
        res.end();
    }
    // if the request is for any file ending with .txt in the logs folder, send the file
    if (req.url.includes('.txt') && req.url.includes('logs/')) {
        var file = req.url.substring(1);
        fs.readFile(file, function (err, data) {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text' });
                res.write('<h1>404 Not Found</h1>');
                res.end();
            } else {
                res.writeHead(200, { 'Content-Type': 'text' });
                res.write(data);
                res.end();
            }
        });
    }
}).listen(config.webport);
client.login(config.token);
