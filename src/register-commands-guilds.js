const { REST, Routes, ApplicationCommandOptionType } = require('discord.js');
require('dotenv').config();

const commands = [
    {
        name: 'chatbot',
        description: 'Talk to Tidus',
        options: [
            {
                name: `input`,
                description: 'What are you saying to him?',
                type: ApplicationCommandOptionType.String,
                required: true,
            }
        ]
    },
    {
        name: 'set-birthday',
        description: 'Have Tidus store your bithday',
        options: [
            {
                name: `month`,
                description: 'month of your bithday',
                type: ApplicationCommandOptionType.Integer,
                required: true,
            },
            {
                name: `day`,
                description: 'day of your bithday',
                type: ApplicationCommandOptionType.Integer,
                required: true,
            }
            
        ]
    },
    {
        name: 'get-birthday',
        description: 'Get users birthday!'
    }
];

const rest = new REST({ version: `10` }).setToken(process.env.TOKEN);

(async () => {

    try {
        console.log('Registering slash commands.....');
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), {
            body: commands
        }
        )
        console.log('Slash commands registered!');
    } catch (error) {
        console.log(`Error has accored with command setup!: ${error}`);
    }
})();