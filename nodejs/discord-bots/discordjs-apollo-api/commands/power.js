const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const api = require('../index').api;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('power')
		.setDescription('Send a power action to a server.')
		.addStringOption(option =>
			option.setName('server_id')
				.setDescription('Server ID')
				.setRequired(true)
				.setMinLength(5)
		)
		.addStringOption(option =>
			option.setName('power_action')
				.setDescription('Select a power action')
				.setRequired(true)
				.addChoices(
					{ name: 'Start', value: 'start' },
					{ name: 'Restart', value: 'restart' },
					{ name: 'Stop', value: 'stop' },
					{ name: 'Kill', value: 'kill' }
				)
		),
	async execute(interaction) {
		// Check if interaction.user has Authorized role
		if (!interaction.member.roles.cache.has(process.env.AUTHORIZED_ROLE)) {
			await interaction.reply({ content: ':warning: You are not authorized to use this command!', ephemeral: true });
			return;
		}
		await interaction.deferReply();

		const server_id = interaction.options.getString('server_id');
		const power_action = interaction.options.getString('power_action');
		const server_status = await api.getServerStatus(server_id);

		// Check if server exists
		if (!server_status) {
			await interaction.editReply({ content: `:warning: Server ID \`${server_id}\` does not exist!`, ephemeral: true });
			return;
		}

		switch (power_action) {
			case 'start':
				await api.startServer(server_id);
				break;
			case 'restart':
				await api.restartServer(server_id);
				break;
			case 'stop':
				await api.stopServer(server_id);
				break;
			case 'kill':
				await api.killServer(server_id);
				break;
			default:
				await interaction.editReply({ content: `:warning: The Power Action \`${power_action}\` does not exist!`, ephemeral: true });
				return;
		}

		const embed = new EmbedBuilder().setColor('#FFEA00').setTitle('Success')
			.setDescription(`:white_check_mark: Successfully sent power action \`${power_action}\` to server \`${server_id}\`.`);
		await interaction.editReply({ embeds: [embed] });
		return;
	},
};