const { MessageEmbed } = require("discord.js");
const replies = require("../../../replies/embedsReplies.json");

module.exports = {
  name: ["removebotadmin"],
  category: "BotAdmins",
  description: "Removes a user from Bot Admins",
  usage: "removebotadmin [user]",
  run: async (client, message, args) => {
    const botAdmin = await new Promise((resolve, reject) =>
      client.db.get(
        `SELECT * FROM "BotAdmins" WHERE id = "${message.member.id}"`,
        (err, row) => (err ? reject(err) : resolve(row))
      )
    );
    if (botAdmin.owner !== "true") return;

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

    const dbUser = await new Promise((resolve, reject) =>
      client.db.get(
        `SELECT * FROM "BotAdmins" WHERE id = "${user.id}"`,
        (err, row) => (err ? reject(err) : resolve(row))
      )
    );
    if (!dbUser)
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setTitle(`${user.user.tag} is not a Bot Admin`)
            .setColor("RED"),
        ],
      });

    client.db.run(`DELETE FROM "BotAdmins" WHERE ("id" = '${user.id}');`);
    message.channel.send({
      embeds: [
        new MessageEmbed()
          .setTitle(`Successfully removes ${user.user.tag} from Bot Admins`)
          .setColor("GREEN"),
      ],
    });
  },
};
