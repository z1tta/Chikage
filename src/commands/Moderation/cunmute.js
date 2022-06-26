const { MessageEmbed } = require("discord.js");
const ms = require("ms");
const replies = require("../../../replies/embedsReplies.json");

module.exports = {
  name: "cunmute",
  description: "Unmutes a member in the current channel",
  usage: "cunmute [member] (reason)",
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
    let reason = "";
    args.forEach((arg) => {
      if (arg !== args[0]) reason = reason + arg + " ";
    });
    await message.channel.permissionOverwrites.edit(user, {
      SEND_MESSAGES: true,
    });
    const successCunmute = new MessageEmbed()
      .setTitle(`${replies.successCunmute.title}${user.user.tag}`)
      .setDescription(`${replies.successCunmute.description}${reason}`)
      .setColor(replies.successCunmute.color);
    await message.channel.send({ embeds: [successCunmute] });
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
