const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kyle')
        .setDescription('Calls kyle a dumbass 5 times'),
    async execute(interaction) {
        const kyle = "223605140752433152"
        const ian = "133684577125400576"
        let mention = `<@${ian}>`;

        let message = '';
        for(let i = 0; i < 5; i++) {
            message += `${mention} is a dumbass\n`
        }
        await interaction.reply(message);
    },
};