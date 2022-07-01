const { MessageEmbed } = require("discord.js");
const replies = require("../../../replies/embedsReplies.json");

module.exports = {
  name: "afk",
  category: "Misc",
  description: "Sets your AFK status",
  usage: "afk (reason)",
  run: async (client, message, args) => {
    const afk = await new Promise((resolve, reject) =>
      client.db.get(
        `SELECT * FROM "AFK" WHERE "userid" = '${message.member.id}';`,
        (err, row) => (err ? reject(err) : resolve(row))
      )
    );
    if (afk)
      return message.channel.send({
        embeds: [
          new MessageEmbed().setTitle(`You're already AFK`).setColor("RED"),
        ],
      });
    const user = message.member;

    let reason = "";
    args.forEach((arg) => {
      reason = reason + arg + " ";
    });
    if (reason.length === 0) {
      reason = "No reason";
    }

    client.db.run(
      `INSERT INTO "AFK" ("userid", "reason") VALUES ('${user.id}', '${reason}')`
    );

    message.channel.send({
      embeds: [
        new MessageEmbed()
          .setTitle(`Successfuly set your AFK status :`)
          .setDescription(reason)
          .setColor("GREEN"),
      ],
    });
  },
};
