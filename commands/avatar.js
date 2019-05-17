const { RichEmbed } = require('discord.js');

module.exports = {
	name: 'avatar',
	description: 'Get the avatar URL of the tagged user(s), or your own avatar.',
	aliases: ['icon', 'pfp'],
	execute(message) {
		if (!message.mentions.users.size) {
            const avatarEmbed = new RichEmbed()
                .setColor('#0099ff')
                .setTitle('Your avatar')
                .setImage(message.author.displayAvatarURL);

			return message.channel.send(avatarEmbed);
		}

		const avatarList = message.mentions.users.map(user => {
            const avatarEmbed = new RichEmbed()
                .setColor('#0099ff')
                .setTitle(`${user.username}'s avatar`)
                .setImage(user.displayAvatarURL);

			return avatarEmbed;
		});

		message.channel.send(avatarList[0]);
	},
};