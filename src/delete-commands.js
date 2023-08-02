const {REST, Routes, ApplicationCommandOptionType} = require('discord.js');
require('dotenv').config();


const rest = new REST({ version: `10` }).setToken(process.env.TOKEN);

(async () => {

    try{
        console.log('Deleting ALL slash commands.....');
        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID), {
                body: []}
        )
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID,process.env.GUILD_ID), {
                body: []}
        )
        console.log('Slash commands deleted!');
    }catch(error)
    {
        console.log(`Error has accored with command setup!: ${error}`);
    }
})();