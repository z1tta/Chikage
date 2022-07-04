const { MessageEmbed, Message } = require("discord.js");
const replies = require("../../../replies/embedsReplies.json");

module.exports = {
  name: ["unfreezenick", "unfn"],
  category: "Moderation",
  description: "Freeze the mentionned member nickname",
  usage: "unfreezenick [user]",
  run: async (client, message, args) => {
    const noPerm = new MessageEmbed()
      .setTitle(replies.noPerm.title)
      .setColor(replies.noPerm.color);
    if (!message.member.permissions.has("MANAGE_NICKNAMES"))
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
    const isFrozen = await new Promise((resolve, reject) =>
      client.db.get(
        `SELECT * FROM "FreezeNick" WHERE "userid" = '${message.member.id}';`,
        (err, row) => (err ? reject(err) : resolve(row))
      )
    );
    if (isFrozen)
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setTitle(`The nickname of this user is not already frozen`)
            .setColor("RED"),
        ],
      });

    client.db.run(`DELETE FROM "FreezeNick" WHERE "userid" = '${user.id}'`);

    message.channel.send({
      embeds: [
        new MessageEmbed()
          .setTitle(`Successfully unfroze ${user.user.tag}'s nickname`)
          .setColor("GREEN"),
      ],
    });
  },
};
