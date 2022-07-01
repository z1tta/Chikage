const { MessageEmbed } = require("discord.js");
const moment = require("moment");
const ms = require("ms");
const replies = require("../../../replies/embedsReplies.json");

module.exports = {
  name: "coinflip",
  category: "Economy",
  description: "Play coinflip",
  usage: "coinflip",
  run: async (client, message, args) => {
    const isOnCooldown = await new Promise((resolve, reject) =>
      client.db.get(
        `SELECT * FROM "CoinflipCooldown" WHERE "userid" = '${message.member.id}';`,
        (err, row) => (err ? reject(err) : resolve(row))
      )
    );
    if (isOnCooldown)
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setTitle(`You can't use this command, please wait \`5s\``)
            .setColor("RED"),
        ],
      });
    const proba = (n) => {
      return !!n && Math.random() <= n;
    };
    const userbalance = await new Promise((resolve, reject) =>
      client.db.get(
        `SELECT * FROM "Balance" WHERE "userid" = '${message.member.id}';`,
        (err, row) => (err ? reject(err) : resolve(row))
      )
    );

    const haveWon = proba(0.5);
    if (haveWon) {
      message.channel.send({
        embeds: [
          new MessageEmbed().setTitle(`🪙 You won 50`).setColor("GREEN"),
        ],
      });
      client.db.run(
        `UPDATE "Balance" SET "balance" = '${
          parseInt(userbalance.balance) + 50
        }' WHERE "userid" = '${message.member.id}';`
      );
    } else
      message.channel.send({
        embeds: [new MessageEmbed().setTitle(`🪙 You lose`).setColor("RED")],
      });
    client.db.run(
      `INSERT INTO "CoinflipCooldown" VALUES ('${message.member.id}')`
    );
    setTimeout(() => {
      client.db.run(
        `DELETE FROM "CoinflipCooldown" WHERE "userid" = '${message.member.id}'`
      );
    }, 5000);
  },
};
