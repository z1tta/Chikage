const { MessageEmbed } = require("discord.js");
const replies = require("../../../replies/embedsReplies.json");

module.exports = {
  name: "unblacklist",
  description: "Removes a user to the blacklist",
  usage: "unblacklist [user]",
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

    const isAlreadyBlacklisted = await new Promise((resolve, reject) =>
      client.db.get(
        `SELECT * FROM "Blacklist" WHERE id = "${user.id}"`,
        (err, row) => (err ? reject(err) : resolve(row))
      )
    );
    if (!isAlreadyBlacklisted)
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setTitle(`${user.user.tag} is not blacklisted`)
            .setColor("RED"),
        ],
      });

    client.db.run(`DELETE FROM "Blacklist" WHERE ("id" = '${user.id}')`);

    const successsBlacklisted = new MessageEmbed()
      .setTitle(`Successfully remove ${user.user.tag} in the Blacklist`)
      .setColor("GREEN");
    message.channel.send({ embeds: [successsBlacklisted] });
  },
};
