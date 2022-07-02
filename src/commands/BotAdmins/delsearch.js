const { MessageEmbed } = require("discord.js");
const replies = require("../../../replies/embedsReplies.json");

module.exports = {
  name: ["delsearch"],
  category: "BotAdmins",
  description: "Deletes a custom search",
  usage: "delsearch [name]",
  run: async (client, message, args) => {
    const botAdmin = await new Promise((resolve, reject) =>
      client.db.get(
        `SELECT * FROM "BotAdmins" WHERE id = "${message.member.id}"`,
        (err, row) => (err ? reject(err) : resolve(row))
      )
    );
    if (botAdmin.owner !== "true") return;

    const searches = await new Promise((resolve, reject) =>
      client.db.all(`SELECT * FROM "CustomSearch"`, (err, rows) =>
        err ? reject(err) : resolve(rows)
      )
    );

    let alreadyexists = false;

    searches.forEach((search) => {
      if (search.name == args[0]) alreadyexists = true;
    });

    if (!alreadyexists) {
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setTitle(`${args[0]} search doesn't exist`)
            .setColor("RED"),
        ],
      });
    }

    const name = args[0];

    if (!name)
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setTitle("Please indicate a valid name")
            .setColor("RED"),
        ],
      });

    client.db.run(`DELETE FROM "CustomSearch" WHERE "name" = '${name}';`);

    message.channel.send({
      embeds: [
        new MessageEmbed()
          .setTitle(`Successfully deleted ${name} custom search`)
          .setColor("GREEN"),
      ],
    });
  },
};
