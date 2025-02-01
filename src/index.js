const fs = require('fs')
const { Client, GatewayIntentBits ,SlashCommandBuilder,TextChannel,WebhookClient, EmbedBuilder} = require('discord.js');
const config = require("../config.json");
const client = new Client({ intents: ['DirectMessages','GuildMessages','Guilds','MessageContent','GuildMembers',GatewayIntentBits.GuildMessageReactions,] });
module.exports = {client}
const commands = {}
const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'))
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands[command.data.name] = command
}
client.on('error',console.error)
client.once("ready", async (c) => {

    const data = []
    for (const commandName in commands) {
        data.push(commands[commandName].data)
    } 
    await client.application.commands.set(data);
    console.log(`${c.user.tag}でログインしました`);
    console.log(`${data.length}個のコマンドを登録しました`)
    /** @type {TextChannel} */
    const channel = client.channels.cache.get('1236565587182747751'); 
    channel.messages.fetch({ limit: 100 }).then(messages => { 
        messages.forEach(async (message) =>{
            message.delete()
            const id = message.content.split(" ")[0]
            const webid = message.content.split(" ")[1]
            const member = await message.guild.members.fetch(id);
            const verifiedRole = message.guild.roles.cache.find(role => role.name === 'メンバー');
            /** @type {TextChannel} */
            const c = await message.guild.channels.fetch("1236579736503844955");
        
    if (member.roles.cache.has(verifiedRole.id)) {
        await member.roles.remove(verifiedRole.id);
        c.send(`${member.toString()}からメンバーのロールを外しました`)
      } else {
        await member.roles.add(verifiedRole.id);
        c.send(`${member.toString()}にメンバーのロールを付けました`)
    
      }
        })
    })
});
client.on("guildMemberAdd",async (member) =>{
    member.send("Rtza_commuityに参加いただきありがとうございますまず最初にこちらで認証してください\nhttps://rtza.rituto.net/")
    /** @type {TextChannel} */
    const c = member.guild.channels.cache.find(c => c.id == "1215822480824991885")
    c.send({embeds:[new EmbedBuilder().setTitle("参加").setColor("Green").setDescription(`${member.toString()}が参加しました`)]})
})
client.on("guildMemberRemove",async (member) =>{
    /** @type {TextChannel} */
    const c = member.guild.channels.cache.find(c => c.id == "1215822480824991885")
    c.send({embeds:[new EmbedBuilder().setTitle("退出").setColor("Red").setDescription(`${member.toString()}が退出しました`)]})
})
client.on("messageCreate",async (message) =>{
    if (message.channelId == "1244065174764126281"){
        const [memberid,type] = message.content.split(" ")
        /** @type {TextChannel} */
        const c = await message.guild.channels.fetch("1215822480824991885");
        message.delete()
        if (type == "1"){
            c.send({embeds:[new EmbedBuilder().setTitle("参加").setColor("Green").setDescription(`<@${memberid}>が参加しました`)]})
        }else{
            c.send({embeds:[new EmbedBuilder().setTitle("退出").setColor("Red").setDescription(`<@${memberid}>が退出しました`)]})

        }
    }
    if (message.channelId  == "1241159982943178772"&&!message.author.bot){
        const id = message.content
        try {
        const member = await message.guild.members.fetch(id);
        if (!member) return await message.reply("エラーメンバーを習得することができませんでした")
        member.send("Rtza_commuityに参加いただきありがとうございますまず最初にこちらで認証してください\nhttps://rtza.rituto.net/")
        message.reply("送信が完了しました")
        }catch(e){
            return await message.reply("エラーメンバーを習得することができませんでした")
        }
    }
    if (message.author.id == "1236570939815231498"){
        message.delete()
        const id = message.content.split(" ")[0]
        const webid = message.content.split(" ")[1]
        const member = await message.guild.members.fetch(id);
        const verifiedRole = message.guild.roles.cache.find(role => role.name === 'メンバー');
        /** @type {TextChannel} */
        const c = await message.guild.channels.fetch("1236579736503844955");
if (member.roles.cache.has(verifiedRole.id)) {
    await member.roles.remove(verifiedRole.id);
    c.send(`${member.toString()}からメンバーのロールを外しました`)
  } else {
    await member.roles.add(verifiedRole.id);
    c.send(`${member.toString()}にメンバーのロールを付けました`)
   
  }
    }
    if (message.content.startsWith("https://discord.com/channels/1215821488628826252/")&&!message.author.bot){
        const channel = await message.guild.channels.fetch(message.content.replace("https://discord.com/channels/1215821488628826252",""))
        message.reply(`name:${channel.name} id:${channel.id} 説明:${channel.topic} チャンネルへ飛ぶ [[${channel.name}]](https://discord.com/channels/1215821488628826252/)`)
    }
})
client.on("interactionCreate", async (interaction) => {
    if (interaction.customId != undefined) return
    try {
        const command = commands[interaction.commandName]
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        const msg = await interaction.fetchReply()
        if (msg)
        await interaction.editReply({
            content: 'コマンドを実行するときにエラーが出ました',
            ephemeral: true,
        });
        else
        await interaction.reply({
            content: 'コマンドを実行するときにエラーが出ました',
            ephemeral: true,
        });
    }
});


client.login(config.token);
