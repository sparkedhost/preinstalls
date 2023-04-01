// Load env file and require the fs module
const fs = require('node:fs');
const path = require('node:path');
cleanENV();
require('dotenv').config();

// Check node.js version
if (Number(process.version.slice(1).split('.')[0]) < 16) {
    console.error('Node.js 16.0.0 or higher is required. Update Node.js on your system.');
    process.exit(1);
}

// Check if BOT_TOKEN is a valid Discord Bot Token
if (!process.env.BOT_TOKEN || process.env.BOT_TOKEN.includes(' ')) {
    console.error('Make sure you\'ve entered the correct Environment variables in the ".env" file');
    console.error('Reason: Invalid Discord Bot Token');
    process.exit(1);
}

// Check if PANEL_URL is a valid URL and PANEL_KEY is a valid Pterodactyl API Key and starts with "ptlc_"
if (!process.env.PANEL_URL || !process.env.PANEL_URL.match(/^https?:\/\/[^\s$.?#].[^\s]*$/)) {
    console.error('Make sure you\'ve entered the correct Environment variables in the ".env" file');
    console.error('Reason: Invalid Panel URL');
    process.exit(1);
}

if (!process.env.PANEL_KEY || !process.env.PANEL_KEY.startsWith('ptlc_')) {
    console.error('Make sure you\'ve entered the correct Environment variables in the ".env" file');
    console.error('Reason: Invalid Panel API Key');
    process.exit(1);
}

// Check if AUTHORIZED_ROLE is a valid Discord Role ID
if (!process.env.AUTHORIZED_ROLE || !((typeof Number(process.env.AUTHORIZED_ROLE)) === 'number')) {
    console.error('Make sure you\'ve entered the correct Environment variables in the ".env" file');
    console.error('Reason: Invalid Authorized Role ID Key');
    process.exit(1);
}


// Create Discord.js Bot and Nodedactyl clients
const { Client, Events, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });


const Nodeactyl = require('nodeactyl');
let api;
try {
    api = new Nodeactyl.NodeactylClient(process.env.PANEL_URL, process.env.PANEL_KEY);
    (async () => {
        const { first_name: firstName, last_name: lastName, username } = await api.getAccountDetails();
        console.log(`Connected to Apollo as ${firstName} ${lastName} (Username: ${username})`);
    })();
} catch (err) {
    console.error('Something went wrong when connecting to Apollo. Try again later.');
    console.error(err);
    process.exit(1);
}


(async () => {
    // Notify console if Discord bot successfully logs in.
    client.once(Events.ClientReady, c => {
        console.log(`Logged in as ${c.user.tag} (ID: ${c.user.id})`);
    });

    // Execute Slash Commands when used
    client.on(Events.InteractionCreate, async interaction => {
        if (!interaction.isChatInputCommand()) return;
    
        const command = interaction.client.commands.get(interaction.commandName);
    
        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }
    
        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(`Something went wrong when running the "${interaction.commandName}" command.`);
            console.error(error);
            //check if interaction is deferred
            if (interaction.deferred) {
                //edit the original response
                await interaction.editReply({ content: '⚠️ There was an error while executing this command!', ephemeral: true });
            } else {
                await interaction.reply({ content: '⚠️ There was an error while executing this command!', ephemeral: true });
            }
        }
    });

    // Detect ratelimit
    client.rest.on('rateLimited', data => {
        console.log('========== Bot Ratelimited ==========');
        console.log(`Error Timestamp: ${Date.now()}`);
        console.log('Is Global: ' + data.global ? 'Yes' : 'No')
        console.log('Ratelimit Data:')
        console.log(data);
        console.log('=====================================');
    })

})();


// Log in to Discord using the provided bot token.
client.login(process.env.BOT_TOKEN).then(async () => {
    // Register Slash Commands
    client.commands = new Collection();
    const commands = [];
    // Grab all the command files from the commands directory you created earlier
    const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const filePath = path.join(__dirname, 'commands', file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            commands.push(command.data.toJSON());
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at "${filePath}" is missing a required "data" and/or "execute" property.`);
        }
    }

    // Construct and prepare an instance of the REST module
    const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        // The put method is used to fully refresh all commands in the guild with the current set
        const data = await rest.put(
            // Routes.applicationCommands(client.application.id),
            Routes.applicationGuildCommands(client.application.id, process.env.SERVER_ID),
            { body: commands },
        );

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (err) {
        console.error('Something went wrong when registering the Slash Commands. Try again later.');
        console.error(err);
        process.exit(1);
    }
});


// Function to trim the values of Environment Variables in the .env file
function cleanENV() {
    // Read the contents of the .env file as a stream
    const stream = fs.readFileSync('.env', 'utf8');

    // Split the stream into an array of lines
    const lines = stream.split('\n');

    let output = '';
    // Iterate through the lines of the file
    for (let line of lines) {
        // Check if the line is an Environment Variable
        if (line.match(/[a-zA-Z,_,-]+\s*=\s*"(.+)"$/m)) {
            // Trim value of the Environment Variable
            const value = line.slice(line.indexOf('=') + 1).slice(1, -1);
            line = line.replace(`"${value}"`, `"${value.trim()}"`);
        }
        // Add the modified line to the output string
        output += line;

        if (line !== lines[lines.length - 1]) {
            output += '\n';
        }
    }

    // Write the modified contents back to the .env file
    fs.writeFileSync('.env', output);
}

module.exports = { api };
