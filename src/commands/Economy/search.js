const { MessageEmbed, Message } = require("discord.js");
const moment = require("moment");
const ms = require("ms");
const replies = require("../../../replies/embedsReplies.json");

module.exports = {
  name: ["search"],
  category: "Economy",
  description: "Gets an acitivity",
  usage: "search [activityname]",
  run: async (client, message, args) => {
    const isInCooldown = await new Promise((resolve, reject) =>
      client.db.get(
        `SELECT * FROM "SearchCooldown" WHERE "userid" = '${message.member.id}';`,
        (err, row) => (err ? reject(err) : resolve(row))
      )
    );
    if (isInCooldown)
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setTitle(`You're in cooldown, please wait \`30s\``)
            .setColor("RED"),
        ],
      });
    const userbalance = await new Promise((resolve, reject) =>
      client.db.get(
        `SELECT * FROM "Balance" WHERE "userid" = '${message.member.id}';`,
        (err, row) => (err ? reject(err) : resolve(row))
      )
    );
    const searches = await new Promise((resolve, reject) =>
      client.db.all(`SELECT * FROM "CustomSearch";`, (err, rows) =>
        err ? reject(err) : resolve(rows)
      )
    );
    if (!searches.length)
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setTitle(`There is no search command`)
            .setColor("RED"),
        ],
      });
    const search = searches[Math.floor(Math.random() * searches.length)];
    const embed = new MessageEmbed();
    embed
      .setTitle(`${search.name} successed`)
      .setDescription(search.description)
      .setColor("GREEN")
      .addField("Gain", `${search.gain}`)
      .addField(
        "Current balance",
        `${parseInt(userbalance.balance) + search.gain}`
      );
    client.db.run(
      `UPDATE "Balance" SET "balance" = '${
        parseInt(userbalance.balance) + search.gain
      }' WHERE "userid" = '${message.member.id}';`
    );
    message.channel.send({ embeds: [embed] });

    client.db.run(
      `INSERT INTO "SearchCooldown" VALUES ('${message.member.id}')`
    );

    setTimeout(() => {
      client.db.run(
        `DELETE FROM "SearchCooldown" WHERE "userid" = '${message.member.id}'`
      );
    }, ms("30s"));
  },
};
