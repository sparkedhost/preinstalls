const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const api = require('../index').api;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('command')
		.setDescription('Send a console command to a server.')
		.addStringOption(option =>
			option.setName('server_id')
				.setDescription('Server ID')
				.setRequired(true)
				.setMinLength(5)
		)
		.addStringOption(option =>
			option.setName('command')
				.setDescription('Command to send to the server\'s console')
				.setRequired(true)
		),
	async execute(interaction) {
		// Check if interaction.user has Authorized role
		if (!interaction.member.roles.cache.has(process.env.AUTHORIZED_ROLE)) {
			await interaction.reply({ content: ':warning: You are not authorized to use this command!', ephemeral: true });
			return;
		}
		await interaction.deferReply();

		const server_id = interaction.options.getString('server_id');
		const command = interaction.options.getString('command');
		const server_status = await api.getServerStatus(server_id);
		
		// Check if server exists 
		if (!server_status) {
			await interaction.editReply({ content: `:warning: Server ID \`${server_id}\` does not exist!` });
			return;
		}

		// Check if server is running
		if (server_status !== 'running') {
			await interaction.editReply({ content: `:warning: Server ID \`${server_id}\` is not running!` });
			return;
		}

		await api.sendServerCommand(server_id, command);

		const embed = new EmbedBuilder().setColor('#FFEA00').setTitle('Success')
			.setDescription(`:white_check_mark: Successfully sent command \`${command}\` to server \`${server_id}\`.`);
		await interaction.editReply({ embeds: [embed] });
		return;
	},
};