const { MessageEmbed, MessageActionRow } = require("discord.js");
const moment = require("moment");
const ms = require("ms");
const replies = require("../../../replies/embedsReplies.json");

module.exports = {
  name: ["coinflip", "cf"],
  category: "Economy",
  description: "Play coinflip",
  usage: "coinflip [heads || tails] [bet]",
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
    const bet = parseInt(args[1]);
    if (!bet)
      return message.channel.send({
        embeds: [
          new MessageEmbed().setTitle(`Please indicate a bet`).setColor("RED"),
        ],
      });
    if (bet > 50)
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setTitle(`You can't bet more than \`50\``)
            .setColor("RED"),
        ],
      });
    if (bet <= 0)
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setTitle(`Please indicate a valid bet`)
            .setColor("RED"),
        ],
      });
    if (bet > userbalance.balance)
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setTitle(`You can't bet more than your current balance`)
            .setColor("RED"),
        ],
      });
    client.db.run(
      `UPDATE "Balance" SET "balance" = '${
        parseInt(userbalance.balance) - bet
      }' WHERE "userid" = '${message.member.id}';`
    );
    let userCoin;
    if (args[0] == "heads" || args[0] == "h") userCoin = 0;
    else if (args[0] == "tails" || args[0] == "t") userCoin = 1;
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
          parseInt(userbalance.balance) + bet * 2
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
