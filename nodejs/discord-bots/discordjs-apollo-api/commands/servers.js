const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const api = require('../index').api;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('servers')
		.setDescription('Returns all servers on the panel.'),
	async execute(interaction) {
		// Check if interaction.user has Authorized role
		if (!interaction.member.roles.cache.has(process.env.AUTHORIZED_ROLE)) {
			await interaction.reply({ content: ':warning: You are not authorized to use this command!', ephemeral: true });
			return;
		}

		const my_servers = await api.getAllServers();
		let server_list = '';
		for (const server of my_servers.data) {
			server_list += `[${server.attributes.name}](${process.env.PANEL_URL}/server/${server.attributes.identifier}) (\`${server.attributes.identifier}\`)\n`;
		}
		
		const embed = new EmbedBuilder().setColor('#FFEA00').setTitle('Apollo Servers')
			.setDescription('Here are your servers hosted on Apollo Panel:\n\n' + ((server_list.length === 0) ? '**Unable to find any servers associated with this account.**' : server_list))
		await interaction.reply({ embeds: [embed] });
		return;
	},
};