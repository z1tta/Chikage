const { MessageEmbed } = require("discord.js");
const replies = require("../../../replies/embedsReplies.json");

module.exports = {
  name: "modifybal",
  category: "BotAdmins",
  description: "Set the mentioned user's balance",
  usage: "modifybal [user] [amount]",
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
    if (!args[0].startsWith("<@") && !args[0].endsWith(">"))
      return message.channel.send({ embeds: [userNotMentionned] });
    const user = message.guild.members.cache.get(
      args[0].split("<@")[1].split(">")[0]
    );
    const cantFindUser = new MessageEmbed()
      .setTitle(replies.cantFindUser.title)
      .setColor(replies.cantFindUser.color);
    if (!user) return message.channel.send({ embeds: [cantFindUser] });
    const userbalance = await new Promise((resolve, reject) =>
      client.db.get(
        `SELECT * FROM "Balance" WHERE "userid" = '${user.id}';`,
        (err, row) => (err ? reject(err) : resolve(row))
      )
    );
    if (!userbalance)
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setTitle(`I can't find the user's balance`)
            .setColor("RED"),
        ],
      });
    const amount = parseInt(args[1]);
    if (!amount)
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setTitle(`Please indicate an amount`)
            .setColor("RED"),
        ],
      });
    if (isNaN(amount))
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setTitle(`Please indicate a valid amount`)
            .setColor("RED"),
        ],
      });
    client.db.run(
      `UPDATE "Balance" SET "balance" = '${amount}' WHERE "userid" = '${user.id}';`
    );
    message.channel.send({
      embeds: [
        new MessageEmbed()
          .setTitle(`Successfully set ${user.user.tag}'s balance to :`)
          .setDescription(`\`${amount}\``),
      ],
    });
  },
};
