const { MessageEmbed } = require("discord.js");
const replies = require("../../../replies/embedsReplies.json");

module.exports = {
  name: "blacklist",
  description: "Adds a user to the blacklist",
  usage: "blacklist [userid]",
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
    const user = await new Promise((resolve, reject) =>
      client.db.get(
        `SELECT * FROM "Users" WHERE id = "${args[0]}"`,
        (err, row) => (err ? reject(err) : resolve(row))
      )
    );
    const cantFindUser = new MessageEmbed()
      .setTitle(replies.cantFindUser.title)
      .setColor(replies.cantFindUser.color);
    if (!user) return message.channel.send({ embeds: [cantFindUser] });

    client.db.run(
      `INSERT INTO "Blacklist" VALUES ('${user.id}')`
    );

    const successsBlacklisted = new MessageEmbed()
      .setTitle(`Successfully add ${user.user.tag} in the Blacklist`)
      .setColor("GREEN");
    message.channel.send({ embeds: [successsBlacklisted] });
  },
};
