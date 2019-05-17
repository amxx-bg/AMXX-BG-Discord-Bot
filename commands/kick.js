const { RichEmbed } = require('discord.js');

module.exports = {
    name: 'kick',
    description: 'Kick member from the discord server',

    execute(message, args) {
        if(!message.mentions.users.size)
            return message.reply('You need to tag an user in order to kick them');

        if(message.member.hasPermission('KICK_MEMBERS')) {
            const taggedUser = message.mentions.users.first();

            if(args.length < 2)
                message.channel.send('The correct usage is: !kick @user reason');
            else {
                const reason = args.slice(1).join(' ');

                const kickMessage = new RichEmbed()
                    .setTitle(`${message.member.user.username} wanted to kick ${taggedUser.username}`)
                    .setColor('0xFF0000')
                    .setDescription(`Reason: ${reason}`);

                if(taggedUser) {
                    const member = message.guild.member(taggedUser);

                    if(member) {
                        message.channel.send(kickMessage);
                        member.kick('You have been kicked for ```' + reason + ' ``` ')
                    }
                }

                // message.channel.send(kickMessage);
            }
        } else
            message.channel.send('```You do not have permissions for this command!```');
    }
};