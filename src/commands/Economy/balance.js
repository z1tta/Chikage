const { MessageEmbed } = require("discord.js");
const moment = require("moment");
const ms = require("ms");
const replies = require("../../../replies/embedsReplies.json");

module.exports = {
  name: "balance",
  category: "Economy",
  description: "Shows your balance",
  usage: "balance",
  run: async (client, message, args) => {
    const userbalance = await new Promise((resolve, reject) =>
      client.db.get(
        `SELECT * FROM "Balance" WHERE "userid" = '${message.member.id}';`,
        (err, row) => (err ? reject(err) : resolve(row))
      )
    );
    if (!userbalance)
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setTitle(`I can't find your balance`)
            .setColor("RED"),
        ],
      });
    message.channel.send({
      embeds: [
        new MessageEmbed()
          .setTitle(`Balance`)
          .setDescription(`${userbalance.balance}`)
          .setColor("GREEN"),
      ],
    });
  },
};
