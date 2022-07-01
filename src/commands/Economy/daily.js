const { MessageEmbed } = require("discord.js");
const moment = require("moment");
const ms = require("ms");
const replies = require("../../../replies/embedsReplies.json");

module.exports = {
  name: "daily",
  category: "Economy",
  description: "Daily income",
  usage: "daily",
  run: async (client, message, args) => {
    const isOnCooldown = await new Promise((resolve, reject) =>
      client.db.get(
        `SELECT * FROM "DailyCooldown" WHERE "userid" = '${message.member.id}';`,
        (err, row) => (err ? reject(err) : resolve(row))
      )
    );
    if (isOnCooldown)
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setTitle(`You can't use this command, please wait \`24h\``)
            .setColor("RED"),
        ],
      });
    const userbalance = await new Promise((resolve, reject) =>
      client.db.get(
        `SELECT * FROM "Balance" WHERE "userid" = '${message.member.id}';`,
        (err, row) => (err ? reject(err) : resolve(row))
      )
    );
    client.db.run(
      `UPDATE "Balance" SET "balance" = '${
        parseInt(userbalance.balance) + 100
      }' WHERE "userid" = '${message.member.id}';`
    );
    client.db.run(
      `INSERT INTO "DailyCooldown" VALUES ('${message.member.id}')`
    );
    message.channel.send({
      embeds: [
        new MessageEmbed()
          .setTitle(`Successfully added \`100\` to your balance`)
          .setColor("GREEN"),
      ],
    });
    setTimeout(() => {
      client.db.run(
        `DELETE FROM "DailyCooldown" WHERE "userid" = '${message.member.id}'`
      );
    }, ms("24h"));
  },
};
