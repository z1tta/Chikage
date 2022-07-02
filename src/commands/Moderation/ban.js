const { MessageEmbed } = require("discord.js");
const replies = require("../../../replies/embedsReplies.json");

module.exports = {
  name: ["ban", "b"],
  category: "Moderation",
  description: "Ban members",
  usage: `ban [member] (reason)`,
  run: async (client, message, args) => {
    const noPerm = new MessageEmbed()
      .setTitle(replies.noPerm.title)
      .setColor(replies.noPerm.color);
    if (!message.member.permissions.has("BAN_MEMBERS"))
      return message.channel.send({ embeds: [noPerm] });
    const userNotMentionned = new MessageEmbed()
      .setTitle(replies.userNotMentionned.title)
      .setColor(replies.userNotMentionned.color);
    if (!args[0]) return message.channel.send({ embeds: [userNotMentionned] });
    if (!args[0].startsWith("<@") && !args[0].endsWith(">"))
      return message.channel.send({ embeds: [userNotMentionned] });
    const user = message.guild.members.cache.get(
      args[0].split("<@")[1].split(">")[0]
    );
    const cantFindUser = new MessageEmbed()
      .setTitle(replies.cantFindUser.title)
      .setColor(replies.cantFindUser.color);
    if (!user) return message.channel.send({ embeds: [cantFindUser] });
    let reason = "";
    args.forEach((arg) => {
      if (arg !== args[0]) reason = reason + arg + " ";
    });
    try {
      await user.ban({
        reason: reason,
      });
    } catch (err) {
      const missingHighestRole = new MessageEmbed()
        .setTitle(replies.missingHighestRole.title)
        .setColor(replies.missingHighestRole.color);
      return message.channel.send({ embeds: [missingHighestRole] });
    }
    const successBan = new MessageEmbed()
      .setTitle(`${replies.successBan.title}${user.user.tag} (${user.user.id})`)
      .setDescription(`${replies.successBan.description}${reason}`)
      .setColor(replies.successBan.color);
    message.channel.send({ embeds: [successBan] });
  },
};
