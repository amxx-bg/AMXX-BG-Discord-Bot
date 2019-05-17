const fs = require('fs');

const Discord = require('discord.js');

const { prefix, token } = require('./config/config.json');

const client = new Discord.Client();

client.commands = new Discord.Collection();

const files = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for(const file of files) {
    const command = require(`./commands/${file}`);

    client.commands.set(command.name, command);
}

client.once('ready', () => {
    console.log('amxxbot is ready');
});

/*! Handling messages */
client.on('message', message => {
    if(!message.content.startsWith(prefix) || message.author.bot)
        return;

        const args = message.content.slice(prefix.length).split(/ +/);
        const command = args.shift().toLowerCase();

        if(!client.commands.has(command))
            return;

        try {
            client.commands.get(command).execute(message, args);
        } catch(error) {
            console.log(error);
            message.reply('There was an error trying to execute that command!');
        }
});

/*! Handling server joins */
client.on('guildMemberAdd', member => {
    const channel = member.guild.channels.find(ch => ch.name === 'join');

    if(!channel)
        return;

    const message = `
        Welcome to ${message.guild.name}, ${member}!\n
        Currently, we have {$message.guild.memberCount} members!\n
        Your username is ${message.author.username} and your ID is ${message.author.id}\n
    `;
    channel.send(`Welcome to ${message.guild.name}, ${member}`);
});

client.login(token);