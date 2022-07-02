const { MessageEmbed } = require("discord.js");
const replies = require("../../../replies/embedsReplies.json");

module.exports = {
  name: ["afkreset"],
  category: "Misc",
  description: "Reset the AFK status of the mentionned user",
  usage: "resetafk [user]",
  run: async (client, message, args) => {
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
    const afk = await new Promise((resolve, reject) =>
      client.db.get(
        `SELECT * FROM "AFK" WHERE "userid" = '${user.id}';`,
        (err, row) => (err ? reject(err) : resolve(row))
      )
    );
    if (!afk)
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setTitle(`This user is not already AFK`)
            .setColor("RED"),
        ],
      });

    client.db.run(`DELETE FROM "AFK" WHERE "userid" = '${user.id}';`);

    message.channel.send({
      embeds: [
        new MessageEmbed()
          .setTitle(`Successfuly reset the AFK status of ${user.user.tag}`)
          .setColor("GREEN"),
      ],
    });
  },
};
