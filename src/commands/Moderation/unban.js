const { MessageEmbed } = require("discord.js");
const replies = require("../../../replies/embedsReplies.json");

module.exports = {
  name: "unban",
  category: "Moderation",
  description: "Unban users",
  usage: `unban [userid] (reason)`,
  run: async (client, message, args) => {
    const noPerm = new MessageEmbed()
      .setTitle(replies.noPerm.title)
      .setColor(replies.noPerm.color);
    if (!message.member.permissions.has("BAN_MEMBERS"))
      return message.channel.send({ embeds: [noPerm] });
    const userIdNotMentionned = new MessageEmbed()
      .setTitle(replies.userIdNotMentionned.title)
      .setColor(replies.userIdNotMentionned.color);
    if (!args[0])
      return message.channel.send({ embeds: [userIdNotMentionned] });
    const user = args[0];
    let reason = "";
    args.forEach((arg) => {
      if (arg !== args[0]) reason = reason + arg + " ";
    });
    await message.guild.bans.remove(user, reason);
    const successUnban = new MessageEmbed()
      .setTitle(
        `${replies.successUnban.title} ${client.users.cache.get(user).tag}`
      )
      .setDescription(`${replies.successUnban.description}${reason}`)
      .setColor(replies.successUnban.color);
    message.channel.send({ embeds: [successUnban] });
  },
};
