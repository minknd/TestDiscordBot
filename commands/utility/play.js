const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, getVoiceConnection, VoiceConnectionStatus, AudioPlayerStatus, entersState } = require('@discordjs/voice');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Joins the server and plays a song'),
    async execute(interaction) {
        // Ensures user is in voice channel
        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel) {
            return interaction.reply('You need to be in a voice channel');
        }

        // Gets voice connection. If no connection, manually create one
        const connection = getVoiceConnection(voiceChannel.guild.id) ?? 
            joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: voiceChannel.guild.id,
                adapterCreator: voiceChannel.guild.voiceAdapterCreator,
            });

        connection.on('stateChange', (oldState, newState) => {
            console.log(`Connection transitioned from ${oldState.status} to ${newState.status}`);
        });

        const filePath = path.join(__dirname, '../../wth.mp3');
        const player = createAudioPlayer();

        // Log player state changes
        player.on('stateChange', (oldState, newState) => {
            console.log(`Audio player transitioned from ${oldState.status} to ${newState.status}`);
        });

        // Log error 
        player.on('error', error => {
            console.error(`Audio player error: ${error.message}`);
        });

        const resource = createAudioResource(filePath);
        try {
            // Waits for connection to be ready
            await entersState(connection, VoiceConnectionStatus.Ready, 30_000);
            connection.subscribe(player);
            player.play(resource);
        } catch (error) {
            console.error('Connection failed to become ready in time:', error);
            return interaction.reply('Failed to join the voice channel in time.');
        }

        console.log('MP3 path: ', filePath);

        await interaction.reply('Playing that shit...');

        player.on(AudioPlayerStatus.Idle, () => {
            connection.destroy();
            console.log('Connection closed')
        });
    },
};