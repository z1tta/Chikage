const { MessageEmbed } = require("discord.js");
const moment = require("moment");
const ms = require("ms");
const replies = require("../../../replies/embedsReplies.json");

module.exports = {
  name: "give",
  category: "Economy",
  description: "Give money to the mentionned user",
  usage: "give [user] [amount]",
  run: async (client, message, args) => {
    const userbalance = await new Promise((resolve, reject) =>
      client.db.get(
        `SELECT * FROM "Balance" WHERE "userid" = '${message.member.id}';`,
        (err, row) => (err ? reject(err) : resolve(row))
      )
    );
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
    if (user.id == message.member.id)
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setTitle(`You can't give money to yourself`)
            .setColor("RED"),
        ],
      });
    const memberbalance = await new Promise((resolve, reject) =>
      client.db.get(
        `SELECT * FROM "Balance" WHERE "userid" = '${user.id}';`,
        (err, row) => (err ? reject(err) : resolve(row))
      )
    );
    if (!memberbalance)
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setTitle(`I can't send money to this user`)
            .setColor("RED"),
        ],
      });
    const amount = args[1];
    if (!amount)
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setTitle(`Please indicate the amount`)
            .setColor("RED"),
        ],
      });
    if (parseInt(amount) > parseInt(userbalance.balance))
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setTitle(`You can't give more money than you have`)
            .setColor("RED"),
        ],
      });
    client.db.run(
      `UPDATE "Balance" SET "balance" = '${
        parseInt(userbalance.balance) - parseInt(amount)
      }' WHERE "userid" = '${message.member.id}';`
    );
    client.db.run(
      `UPDATE "Balance" SET "balance" = '${
        parseInt(memberbalance.balance) + parseInt(amount)
      }' WHERE "userid" = '${user.id}';`
    );
    message.channel.send({
      embeds: [
        new MessageEmbed()
          .setDescription(`Successfully gave ${amount} to ${user}`)
          .setColor("GREEN"),
      ],
    });
  },
};
