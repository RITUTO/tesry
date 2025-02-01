const { SlashCommandBuilder,EmbedBuilder,CommandInteraction,codeBlock} = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
	.setName('ping')
	.setDescription('Replies with Pong!')
	.setDescriptionLocalization('ja',"ping値を返します"),
	/**@param {CommandInteraction} interaction  */
	async execute(interaction) {
		await interaction.reply('習得中')
		const msg = await interaction.fetchReply()
		await interaction.editReply({
			content:'',
			embeds:[
			new EmbedBuilder()
			.setTitle('ping')
			.setDescription(`WebSocket Ping: ${codeBlock(interaction.client.ws.ping+'ms')}ms\nAPI Endpoint Ping: ${codeBlock(msg.createdTimestamp - interaction.createdTimestamp+'ms')}`)
		]});
	}
}
