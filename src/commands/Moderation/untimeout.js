const { MessageEmbed } = require("discord.js");
const ms = require("ms");
const replies = require("../../../replies/embedsReplies.json");

module.exports = {
  name: "untimeout",
  description: "Removes a member timeout",
  usage: "untimeout (reason)",
  run: async (client, message, args) => {
    const noPerm = new MessageEmbed()
      .setTitle(replies.noPerm.title)
      .setColor(replies.noPerm.color);
    if (!message.member.permissions.has("MODERATE_MEMBERS"))
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
    const userNotInTimeout = new MessageEmbed()
      .setTitle(replies.userNotInTimeout.title)
      .setColor(replies.userNotInTimeout.color);
    if (!user.isCommunicationDisabled())
      return message.channel.send({ embeds: [userNotInTimeout] });
    let reason = "";
    args.forEach((arg) => {
      if (arg !== args[0] && arg !== args[1]) reason = reason + arg + " ";
    });
    await user.timeout(0, reason);
    const successUntimeout = new MessageEmbed()
      .setTitle(`${replies.successUntimeout.title}${user.user.tag}`)
      .setDescription(`${replies.successUntimeout.description}${reason}`)
      .setColor(replies.successUntimeout.color);
    await message.channel.send({ embeds: [successUntimeout] });
    if (cooldown && !message.member.permissions.has("ADMINISTRATOR")) {
      await new Promise((resolve, reject) =>
        client.db.get(
          `UPDATE "Users" SET "isInCooldown" = 'true' WHERE "id" = '${message.member.id}'`,
          (err, row) => (err ? reject(err) : resolve(row))
        )
      );
      setTimeout(async () => {
        await new Promise((resolve, reject) =>
          client.db.get(
            `UPDATE "Users" SET "isInCooldown" = 'false' WHERE "id" = '${message.member.id}'`,
            (err, row) => (err ? reject(err) : resolve(row))
          )
        );
      }, cooldown);
    }
  },
};
