const {REST, Routes, ApplicationCommandOptionType} = require('discord.js');
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
   // {
   //     name: 'joinvc',
  //      description: 'Tidus Please Join VC!',
   ///     options: [
     //       {
  //              name: `channel`,
   //             description: 'What channel?',
  //              type: ApplicationCommandOptionType.Channel,
    //            required: true,
   //         }
   //     ]
    //},
];

const rest = new REST({ version: `10` }).setToken(process.env.TOKEN);

(async () => {

    try{
        console.log('Registering slash commands.....');
        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID), {
                body: commands}
        )
        console.log('Slash commands registered!');
    }catch(error)
    {
        console.log(`Error has accored with command setup!: ${error}`);
    }
})();