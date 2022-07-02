const { MessageEmbed } = require("discord.js");
const replies = require("../../../replies/embedsReplies.json");

module.exports = {
  name: ["modifybal"],
  category: "BotAdmins",
  description: "Set the mentioned user's balance",
  usage: "modifybal [ + || - ] [amount] [user]",
  run: async (client, message, args) => {
    const botAdmin = await new Promise((resolve, reject) =>
      client.db.get(
        `SELECT * FROM "BotAdmins" WHERE id = "${message.member.id}"`,
        (err, row) => (err ? reject(err) : resolve(row.id))
      )
    );
    if (!botAdmin) return;
    if (!args[0])
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setTitle(`Please indicate \`+\` or \`-\``)
            .setColor("RED"),
        ],
      });
    let add;
    if (args[0] == "+") add = true;
    else if (args[0] == "-") add = false;
    else
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setTitle(`Please indicate \`+\` or \`-\``)
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
    const userNotMentionned = new MessageEmbed()
      .setTitle(replies.userNotMentionned.title)
      .setColor(replies.userNotMentionned.color);
    if (!args[2]) return message.channel.send({ embeds: [userNotMentionned] });
    if (!args[2].startsWith("<@") && !args[2].endsWith(">"))
      return message.channel.send({ embeds: [userNotMentionned] });
    const user = message.guild.members.cache.get(
      args[2].split("<@")[1].split(">")[0]
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
    if (add) {
      client.db.run(
        `UPDATE "Balance" SET "balance" = '${
          userbalance.balance + amount
        }' WHERE "userid" = '${user.id}';`
      );
      message.channel.send({
        embeds: [
          new MessageEmbed()
            .setTitle(`Successfully added to ${user.user.tag}'s balance : `)
            .setDescription(`\`${amount}\``)
            .setColor("GREEN"),
        ],
      });
    } else {
      client.db.run(
        `UPDATE "Balance" SET "balance" = '${
          userbalance.balance - amount
        }' WHERE "userid" = '${user.id}';`
      );
      message.channel.send({
        embeds: [
          new MessageEmbed()
            .setTitle(`Successfully removed to ${user.user.tag}'s balance : `)
            .setDescription(`\`${amount}\``)
            .setColor("GREEN"),
        ],
      });
    }
  },
};
