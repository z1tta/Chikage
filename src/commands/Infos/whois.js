const { MessageEmbed } = require("discord.js");
const replies = require("../../../replies/embedsReplies.json");

module.exports = {
  name: "whois",
  category: "Infos",
  description: "Shows the servers joined by the mentionned user and the bot",
  usage: "whois [user]",
  run: async (client, message, args) => {
    const userNotMentionned = new MessageEmbed()
      .setTitle(replies.userNotMentionned.title)
      .setColor(replies.userNotMentionned.color);
    if (!args[0]) return message.channel.send({ embeds: [userNotMentionned] });
    const user = message.guild.members.cache.get(args[0]);
    const cantFindUser = new MessageEmbed()
      .setTitle(replies.cantFindUser.title)
      .setColor(replies.cantFindUser.color);
    if (!user) return message.channel.send({ embeds: [cantFindUser] });

    const embed = new MessageEmbed()
      .setDescription(`${user} is on these servers:`)
      .setColor("GREEN");
    const servers = client.guilds.cache
      .map((g) => g)
      .filter((g) => g.members.cache.has(user.id));
    servers.forEach((server) => {
      embed.addField(server.name, server.id, true);
    });
    message.channel.send({ embeds: [embed] });
  },
};
