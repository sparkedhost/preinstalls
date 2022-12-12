const { ChannelType, PermissionsBitField, guild, EmbedBuilder } = require('discord.js');
const { supportRole } = require('../config.json')

module.exports = {
	id: 'ticket_claim',
	permissions: [PermissionsBitField.Flags.ManageChannels],
	run: async (client, interaction) => {

        // const channel = 
        const srole = interaction.guild.roles.cache.get(supportRole)
        const role = interaction.guild.roles.cache.get(supportRole)

        const claimed = new EmbedBuilder()
        .setDescription(`Ticket Claimed by: <@${interaction.user.id}>`)
        .setColor('Yellow')
        interaction.reply({embeds: [claimed]})

        interaction.channel.permissionOverwrites.set([
                {
                        id: role,
                        deny: [PermissionsBitField.Flags.SendMessages],
                },
                {
                        id: interaction.user.id,
                        allow: [PermissionsBitField.Flags.SendMessages],
                },
                {
                        id: srole,
                        deny: [PermissionsBitField.Flags.SendMessages]
                },
                {
                        id: interaction.guild.id,
                        deny: [PermissionsBitField.Flags.ViewChannel]

                },
        ]);

        // const role = interaction.guild.roles.cache.get("1022205759540428830")
        interaction.channel.edit({topic: `Assisting Staff Member: <@${interaction.user.id}>\nTicket Status: **CLAMED** `})
	}
};