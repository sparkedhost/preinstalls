const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds, 
		GatewayIntentBits.GuildMessages, 
		GatewayIntentBits.GuildPresences, 
		GatewayIntentBits.MessageContent, 
		GatewayIntentBits.GuildMessageReactions, 
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildIntegrations,
		GatewayIntentBits.GuildBans,
		GatewayIntentBits.GuildInvites,	
		GatewayIntentBits.GuildMessages
	], 
	partials: [Partials.Channel, Partials.Message, Partials.User, Partials.GuildMember, Partials.Reaction] 
});

const config = require('./config.json');
require('dotenv').config() // remove this line if you are using replit

client.commands = new Collection()
client.aliases = new Collection()
client.slashCommands = new Collection();
client.buttons = new Collection();
client.prefix = config.prefix;

module.exports = client;

const fs = require('fs')

fs.readdirSync('./handlers').forEach((handler) => {
  require(`./handlers/${handler}`)(client)
});

//sharding
// const { ShardingManager } = require('discord.js');

// const manager = new ShardingManager('./index.js', { token: process.env.TOKEN });

// manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`));

// manager.spawn();

const config = require('./config.json')
client.login(config.Bot.Token)