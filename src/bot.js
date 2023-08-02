require("dotenv").config();
const { joinVoiceChannel, getVoiceConnections } = require('@discordjs/voice');
const { Client, GatewayIntentBits } = require('discord.js');
const { connection } = require("mongoose");
var mysql = require('mysql');

var con = mysql.createPool({
    host: "localhost",
    user: "root",
    password: `${process.env.DATABASE_KEY}`,
    database: 'Tidusbot'
})


const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});
const { Configuration, OpenAIApi } = require('openai');
const configuration = new Configuration(
    {
        organization: process.env.OPENAI_ORG,
        apiKey: process.env.OPENAI_KEY,
    }
);
const openai = new OpenAIApi(configuration);

async function queryDB(sql,error2,connection,interaction)
{
    connection.query(sql, function (err2, results, fields){
        if(err2)
        {
            error2 = true;
            console.log(err2);
            console.log(err2.errno);
            if(err2.errno === 1062)
            {
                interaction.reply("Birthday already logged!");
                error2 = true;
               
            }
            if(err2.errno === 1406)
            {
                interaction.reply("Wrong Format!");
                error2 = true;
               
            }

          
        }
        if(error2 === false)
        interaction.reply("Your birthday has been saved!");
        console.log(results)
        return error2;
    })
}


const prefix = '?';
client.on('ready', () => {
    console.log(`Bot is Ready! ${client.user.tag}`)
});

client.on('interactionCreate', async function (interaction, message) {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === `chatbot`) {
        try {
            const args = interaction.options.get('input').value;
            console.log(args);
            const gptResponse = await openai.createCompletion({
                model: "text-davinci-003",
                prompt: `You are Tidus and will be called Tidus. \n\
                Tidus is a the main character of Final Fantasy 10 and is very flirty to everyone. Tidus is a bit sassy to everyone he speaks to. \n\
                ${interaction.member.id}: ${args.toString()}\n`,
                temperature: 0.9,
                max_tokens: 2000,

            })
            interaction.reply(`${gptResponse.data.choices[0].text}`);
            return;
        } catch (err) {
            console.log(err + " Chatbot error");
        }


    }
    if (interaction.commandName === `joinvc`) {
        const voiceChannel = interaction.options.getChannel('channel');
        const voiceConnection = await joinVoiceChannel({
            channelId: voiceChannel.id,
            guildID: interaction.guildId,
            adapterCreator: interaction.guild.voiceAdapterCreator,
        });

        console.log(getVoiceConnections());
    }
    if (interaction.commandName === `set-birthday`) {
        let error2 = false;
        try {
            
            const monthbday = interaction.options.get('month').value;
            const daybday = interaction.options.get('day').value;
            const datebday = monthbday + '/' + daybday;
            const sql = `INSERT INTO Birthday(userID, userName, birthDate) VALUES ('${interaction.user.id}','${interaction.user.username}','${datebday}');`
            console.log(sql);
           con.getConnection(async function (err, connection) {
                
                console.log("DB Connected!");
                if(err)
                {
                    console.log(err);
                    return;
                }

              
                const res = await queryDB(sql,error2,connection,interaction);
                error2 = res;
              
               
            });
            
        } catch (error) {
            console.log(error + "Date!");
            interaction.reply("Wrong Format MM/DD!");
        }




    }
    if(interaction.commandName === `get-birthday`){
        con.getConnection(function (err, connection) {
            console.log("DB Connected!");
            const sql = `SELECT birthDate FROM Birthday WHERE userID = '${interaction.user.id}';`
            if(err)
            {
                console.log(err);
                return;
            }
            connection.query(sql, function (err2, results, fields){
                if(err2)
                {
                    console.log(err2);
                    return;
                }
                if(results && results.length > 0)
                    interaction.reply(interaction.user.username + " your birthday is " + results[0].birthDate);
                else
                interaction.reply(interaction.user.username + " your birthday was not logged! Consider using /set-birthday");
            })
            
            connection.release();
        });
    }


});
client.on('messageCreate', async function (message) {

    try {

        if (message.author.bot || !message.content.startsWith(prefix)) return;
        const args = message.content.slice(prefix.length).split(/ +/);

        const gptResponse = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `You are Tidus and will be called Tidus. \n\
        Tidus is a the main character of Final Fantasy 10 and is very flirty to everyone. Tidus is a bit sassy to everyone he speaks to. \n\
        ${message.author.username}: ${args}\n`,
            temperature: 0.9,
            max_tokens: 2000,

        })
        message.reply(`${gptResponse.data.choices[0].text}`);
        console.log(args.toString());
        return;
    } catch (err) {
        console.log(err + " Error");
    }

});

client.login(process.env.TOKEN);