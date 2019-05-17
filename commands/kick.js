module.exports = {
    name: 'kick',
    description: 'Fake kick',
    execute(message, args) {
        if(!message.mentions.users.size)
            return message.reply('You need to tag an user in order to kick them');

        const taggedUser = message.mentions.user.first();

        message.channel.send(`You wanted to kick ${taggedUser.username}`);

        if(taggedUser.username === 'Evil') {
            message.channel.send(`Since it's ${taggedUser.username}, I will actually kick him!`);
        }
    }
};