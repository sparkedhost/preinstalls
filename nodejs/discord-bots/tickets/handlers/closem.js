const { ApplicationCommandType, ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	name: 'tclose',
	description: "Close the ticket",
    default_member_permissions: 'ManageChannels',
	type: ApplicationCommandType.ChatInput,
	cooldown: 3000,
	run: async (client, interaction) => {
        const buttons = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setLabel('Close Ticket')
            .setStyle('Danger')
            .setCustomId('ticket_close')
        );

        const cemb = new EmbedBuilder()
        .setDescription(`Are you sure you want to close this ticket?\n> Please note, closing this ticket will delete this channel. Meaning, all content will be lost.`)
        .setColor('Red')

        interaction.reply({embeds: [cemb], components: [buttons], ephemeral: true})
    }
};