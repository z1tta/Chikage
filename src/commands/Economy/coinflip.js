const { MessageEmbed } = require("discord.js");
const moment = require("moment");
const ms = require("ms");
const replies = require("../../../replies/embedsReplies.json");

module.exports = {
  name: ["coinflip", "cf"],
  category: "Economy",
  description: "Play coinflip",
  usage: "coinflip [heads || tails]",
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
    const userbalance = await new Promise((resolve, reject) =>
      client.db.get(
        `SELECT * FROM "Balance" WHERE "userid" = '${message.member.id}';`,
        (err, row) => (err ? reject(err) : resolve(row))
      )
    );
    if (!args[0])
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setTitle(`Please indicate \`heads\` or \`tails\``)
            .setColor("RED"),
        ],
      });
    let userCoin;
    if (args[0] == "heads") userCoin = 0;
    else if (args[0] == "tails") userCoin = 1;
    else
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setTitle(`Please indicate \`heads\` or \`tails\``)
            .setColor("RED"),
        ],
      });
    const botCoin = Math.round(Math.random());

    let haveWon;
    if (userCoin === botCoin) haveWon = true;
    else haveWon = false;
    if (haveWon) {
      message.channel.send({
        embeds: [
          new MessageEmbed()
            .setTitle(
              `🪙 ${botCoin
                .toString()
                .replace("0", "Heads")
                .replace("1", "Tails")}, you won !`
            )
            .setColor("GREEN"),
        ],
      });
      client.db.run(
        `UPDATE "Balance" SET "balance" = '${
          parseInt(userbalance.balance) + 50
        }' WHERE "userid" = '${message.member.id}';`
      );
    } else
      message.channel.send({
        embeds: [
          new MessageEmbed()
            .setTitle(
              `🪙 ${botCoin
                .toString()
                .replace("0", "Heads")
                .replace("1", "Tails")}, you lose`
            )
            .setColor("RED"),
        ],
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
