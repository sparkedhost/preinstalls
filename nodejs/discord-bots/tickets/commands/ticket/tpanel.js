const { ActionRowBuilder, EmbedBuilder, ButtonBuilder } = require('discord.js')

module.exports = {
	name: 'ticketp',
	description: "Check bot's ping.",
	cooldown: 3000,
	userPerms: ['Administrator'],
	botPerms: [],
	run: async (client, message, args) => {
        const buttons = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setLabel('Create a Ticket')
            .setStyle('Success')
            .setCustomId('ticket_create')
        );

        const embed = new EmbedBuilder()
        .setTitle(`Create a ticket!`)
        .setColor(`Green`)
        .setDescription(`To create a ticket, please click the button below.\n> If you need support, or want to order. This is what you want to do.`)
        message.channel.send({embeds: [embed], components: [buttons]})
	}
};