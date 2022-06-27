const { MessageEmbed } = require("discord.js");
const replies = require("../../../replies/embedsReplies.json");

module.exports = {
  name: "dm",
  description: "Send a Direct Message to the mentionned user",
  usage: "",
  run: async (client, message, args, cooldown) => {
    const botAdmin = await new Promise((resolve, reject) =>
      client.db.get(
        `SELECT * FROM "BotAdmins" WHERE id = "${message.member.id}"`,
        (err, row) => (err ? reject(err) : resolve(row.id))
      )
    );
    if (!botAdmin) return;

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
    let dmMessage = "";
    args.forEach((arg) => {
      if (arg !== args[0]) dmMessage = dmMessage + arg + " ";
    });
    if (!dmMessage)
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setTitle(`Please indicate a message to send`)
            .setColor("RED"),
        ],
      });
    await user.user.send(dmMessage);
    return message.channel.send({
      embeds: [
        new MessageEmbed()
          .setTitle(`Successfully sent to ${user.user.tag} :`)
          .setDescription(dmMessage)
          .setColor("GREEN"),
      ],
    });

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
