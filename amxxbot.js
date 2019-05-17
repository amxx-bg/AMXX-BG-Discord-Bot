const fs = require('fs');

const Discord = require('discord.js');

const { prefix, token } = require('./config/config.json');

const client = new Discord.Client();

client.commands = new Discord.Collection();

/*! Cooldowns collection */
const cooldowns = new Discord.Collection();

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
        const commandName = args.shift().toLowerCase();

        const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) return;

        if (command.guildOnly && message.channel.type !== 'text')
            return message.reply(`I can't execute that command inside DMs!`);
        
        if (command.args && !args.length) {
            let reply = `You didn't provide any arguments, ${message.author}!`;
    
            if (command.usage) {
                reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
            }
    
            return message.channel.send(reply);
        }
    
        if (!cooldowns.has(command.name)) {
            cooldowns.set(command.name, new Discord.Collection());
        }
    
        const now = Date.now();
        const timestamps = cooldowns.get(command.name);
        const cooldownAmount = (command.cooldown || 3) * 1000;
    
        if (timestamps.has(message.author.id)) {
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
    
            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                return message.reply(`Please wait **${timeLeft.toFixed(1)}** more second(s) before reusing the **\`${command.name}\`** command.`);
            }
        }
    
        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

        try {
            command.execute(message, args);
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