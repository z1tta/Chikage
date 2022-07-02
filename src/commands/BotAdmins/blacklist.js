const { MessageEmbed } = require("discord.js");
const replies = require("../../../replies/embedsReplies.json");

module.exports = {
  name: ["blacklist", "bl"],
  category: "BotAdmins",
  description: "Adds a user to the blacklist",
  usage: "blacklist [userid]",
  run: async (client, message, args) => {
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
    const user = message.guild.members.cache.get(args[0]);
    const cantFindUser = new MessageEmbed()
      .setTitle(replies.cantFindUser.title)
      .setColor(replies.cantFindUser.color);
    if (!user) return message.channel.send({ embeds: [cantFindUser] });

    const userAdmin = await new Promise((resolve, reject) =>
      client.db.get(
        `SELECT * FROM "BotAdmins" WHERE id = "${user.id}"`,
        (err, row) => (err ? reject(err) : resolve(row))
      )
    );
    if (userAdmin)
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setTitle(`This user can't be blacklisted`)
            .setColor("RED"),
        ],
      });

    const isAlreadyBlacklisted = await new Promise((resolve, reject) =>
      client.db.get(
        `SELECT * FROM "Blacklist" WHERE id = "${user.id}"`,
        (err, row) => (err ? reject(err) : resolve(row))
      )
    );
    if (isAlreadyBlacklisted)
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setTitle(`${user.user.tag} is already blacklisted`)
            .setColor("RED"),
        ],
      });

    client.db.run(`INSERT INTO "Blacklist" VALUES ('${user.id}')`);

    const successsBlacklisted = new MessageEmbed()
      .setTitle(`Successfully add ${user.user.tag} in the Blacklist`)
      .setColor("GREEN");
    message.channel.send({ embeds: [successsBlacklisted] });
  },
};
