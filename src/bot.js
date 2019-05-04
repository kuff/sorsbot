const {
    token, 
    self_id, 
    join_channel_id, 
    afk_channel_id
} = require('../config.json');
const { notifyAdmin } = require('./util.js');
const Discord = require('discord.js');

const client = new Discord.Client();

client.on('ready', () => 
    // bot successfully connected to Discord
    console.log(`${client.user.username}#${client.user.discriminator} is up and running!`)
);

client.on('voiceStateUpdate', async (oldMember, newMember) => {
    const newVoiceChannel = newMember.voiceChannel;
    // if a member joins the dynamic voice channel, create a new voice channel and put them their
    if (newVoiceChannel && newVoiceChannel.id === join_channel_id)
        // create the new voice channel
        newMember.guild.createChannel((newMember.displayName + "'s channel"), 'voice')
            // set category of new voice channel
            .then(memberChannel => memberChannel.setParent(newVoiceChannel.parent)
            // move member into their new voice channel
            .then(() => newMember.setVoiceChannel(memberChannel))
            // report any errors to the member and the server admin
            .catch(reason => {
                newMember.sendMessage(`Dynamic voice failed: ${reason}. Admins have been notified of the issue!`);
                notifyAdmin(client, `Dynamic voice failed for user ${newMember.displayName} with reason: ${reason}`);
            })
        );
    const oldVoiceChannel = oldMember.voiceChannel;
    // if a member leaves a voice channel as the last member, delete it
    if (oldVoiceChannel && oldVoiceChannel.id !== afk_channel_id && oldVoiceChannel.id !== join_channel_id && oldVoiceChannel.members.size == 0)
            // delete the channel
            oldVoiceChannel.delete('Channel no longer in use')
            // report any errors to the server admin
            .catch(reason =>
                notifyAdmin(client, `Dynamic voice channel ${oldVoiceChannel.name} could not be deleted with reason: ${reason}`)
            );
});

client.login(token).catch(reason => 
    // report error in connect
    console.log(`Unable to connect to Discord using ${token}. Reason: ${reason}`));