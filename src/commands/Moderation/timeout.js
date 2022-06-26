const { MessageEmbed } = require("discord.js");
const ms = require("ms");
const replies = require("../../../replies/embedsReplies.json");

module.exports = {
  name: "timeout",
  description: "Sends a member into a timeout",
  usage: "timeout [member] [duration] (reason)",
  run: async (client, message, args, cooldown) => {
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
    const durationMissing = new MessageEmbed()
      .setTitle(replies.durationMissing.title)
      .setColor(replies.durationMissing.color);
    if (!args[1]) return message.channel.send({ embeds: [durationMissing] });
    const duration = ms(args[1]);
    const invalidDuration = new MessageEmbed()
      .setTitle(replies.invalidDuration.title)
      .setColor(replies.invalidDuration.color);
    if (!duration) return message.channel.send({ embeds: [invalidDuration] });
    let reason = "";
    args.forEach((arg) => {
      if (arg !== args[0] && arg !== args[1]) reason = reason + arg + " ";
    });
    await user.timeout(duration, reason);
    const successTimeout = new MessageEmbed()
      .setTitle(`${replies.successTimeout.title}${user.user.tag}`)
      .setDescription(`${replies.successTimeout.description}${reason}`)
      .setColor(replies.successTimeout.color);
    await message.channel.send({ embeds: [successTimeout] });
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
