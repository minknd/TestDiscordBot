const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('run')
        .setDescription('Calls you a dumbass'),
    async execute(interaction) {
        // interaction.user is the object representing the User who ran the command
        await interaction.reply(`${interaction.user} is a dumbass`);
    },
};