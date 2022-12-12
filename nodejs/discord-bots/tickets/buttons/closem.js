const { ChannelType, PermissionsBitField, guild, EmbedBuilder } = require('discord.js')

module.exports = {
	id: 'ticket_closem',
	permissions: [PermissionsBitField.Flags.ManageChannels],
	run: async (client, interaction) => {


        const le = new EmbedBuilder()
        .setColor("Red")
        .setDescription('Ticket closing in `5 seconds.`')
        
        await interaction.reply({ embeds: [le]});
        interaction.channel.edit({topic: `Assisted by: <@${interaction.user.id}>\nTicket Status: **CLOSED** `})
        setTimeout(()=> {interaction.channel.delete()}, 5000)


	}
};