const { verifyRole } = require('../config.json');
const { ChannelType, PermissionsBitField, guild, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js')

module.exports = {
	id: 'ticket_close',
	permissions: [PermissionsBitField.Flags.ManageChannels],
	run: async (client, interaction) => {

        const buttons = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setLabel('Confrim Close')
            .setStyle('Danger')
            .setCustomId('ticket_closem')
        );

        const cemb = new EmbedBuilder()
        .setDescription(`Are you sure you want to close this ticket?\n> Please note, closing this ticket will delete this channel. Meaning, all content will be lost.`)
        .setColor('Red')

        interaction.reply({embeds: [cemb], components: [buttons], ephemeral: true })

        // const le = new EmbedBuilder()
        // .setColor("Red")
        // .setDescription('Ticket closing in `5 seconds.`')
        
        // await interaction.reply({embeds: [le]});
        // interaction.channel.edit({topic: `Assisted by: <@${interaction.user.id}>\nTicket Status: **CLOSED** `})
        // setTimeout(()=> {interaction.channel.delete()}, 5000)


	}
};