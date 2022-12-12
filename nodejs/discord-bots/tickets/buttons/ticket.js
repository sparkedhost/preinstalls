const { supportRole } = require('../config.json');
const { ChannelType, PermissionsBitField, guild, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');

module.exports = {
	id: 'ticket_create',
	permissions: [],
	run: async (client, interaction, message) => {
        const srole = interaction.guild.roles.cache.get(supportRole)
        const role = interaction.guild.roles.cache.get(supportRole)
        // const tc = new EmbedBuilder()ß
        // .setColor('Green')
        // .setDescription(`Your ticket has been created!\n <#${c.id}>`)
        await interaction.guild.channels.create({
            name: `ticket-${interaction.user.username}`,
            topic: `Awaiting Staff Member Assistant.\nTicket Status: **OPEN**`,
            type: ChannelType.GuildText,
            permissionOverwrites: [
                {
                    id: interaction.guild.id,
                    deny: [PermissionsBitField.Flags.ViewChannel],
                },
                {
                    id: interaction.user.id,
                    allow: [PermissionsBitField.Flags.ViewChannel],
                },
                {
                    id: role,
                    allow: [PermissionsBitField.Flags.ViewChannel]
                },
                {
                    id: srole,
                    allow: [PermissionsBitField.Flags.ViewChannel]
                }
            ],
        }).then(async c => {

            const buttons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setLabel('Close Ticket')
                .setStyle('Danger')
                .setCustomId('ticket_close'),
                new ButtonBuilder()
                .setLabel('Claim Ticket')
                .setStyle('Success')
                .setCustomId('ticket_claim')
            );


            const tc = new EmbedBuilder()
            .setColor('Green')
            .setDescription(`Your ticket has been created!\n <#${c.id}>`)
            interaction.reply({embeds: [tc], ephemeral: true})

            const e = new EmbedBuilder()
            .setColor('Green')
            .setDescription(`Ticket Created, please let us know what you need and someone will be with you shortly!\n> Please wait for a reply. Do not ping any of our support team, we may close continue your request.`)
// sending mention of user, embed and support role.
            message = await c.send({
                content: `<@${interaction.user.id}>`,
                embeds: [e],
                components: [buttons]
            })

            let msg = await c.send({content: `${role}`});
            setTimeout(()=> {msg.delete()}, 500)
        });

        // const e = new EmbedBuilder()
        // .setDescription(`Ticket Created, please wait for a reply.`)


        // message = await c.send({
        //     content: `<@${interaction.id}>`,
        //     embeds: [e]
        // })

        //await interaction.reply({embeds: [tc], ephemeral: true})
	}
};