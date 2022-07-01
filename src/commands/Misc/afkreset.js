const { MessageEmbed } = require("discord.js");
const replies = require("../../../replies/embedsReplies.json");

module.exports = {
  name: "afkreset",
  category: "Misc",
  description: "Reset your AFK status",
  usage: "resetafk",
  run: async (client, message, args) => {
    const afk = await new Promise((resolve, reject) =>
      client.db.get(
        `SELECT * FROM "AFK" WHERE "userid" = '${message.member.id}';`,
        (err, row) => (err ? reject(err) : resolve(row))
      )
    );
    if (!afk)
      return message.channel.send({
        embeds: [
          new MessageEmbed().setTitle(`You're not already AFK`).setColor("RED"),
        ],
      });
    const user = message.member;

    client.db.run(`DELETE FROM "AFK" WHERE "userid" = '${user.id}';`);

    message.channel.send({
      embeds: [
        new MessageEmbed()
          .setTitle(`Successfuly reset your AFK status`)
          .setColor("GREEN"),
      ],
    });
  },
};
