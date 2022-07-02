const { MessageEmbed } = require("discord.js");
const ms = require("ms");
const replies = require("../../../replies/embedsReplies.json");

module.exports = {
  name: ["addsearch"],
  category: "BotAdmins",
  description: "Add a custom search",
  usage: "addsearch [name] [gain] [description]",
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

    if (alreadyexists) {
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setTitle(`${args[0]} search already exists`)
            .setColor("RED"),
        ],
      });
    }

    const name = args[0];
    const gain = args[1];
    let description = "";
    args.forEach((arg) => {
      if (arg != args[0] && arg !== args[1])
        description = description + arg + " ";
    });

    if (!name)
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setTitle("Please indicate a valid name")
            .setColor("RED"),
        ],
      });
    if (!gain)
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setTitle("Please indicate a valid gain")
            .setColor("RED"),
        ],
      });
    if (!description)
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setTitle("Please indicate a valid description")
            .setColor("RED"),
        ],
      });
    if (description.includes("'"))
      return message.channel.send({
        embeds: [
          new MessageEmbed().setTitle(`You can't use \`'\``).setColor("RED"),
        ],
      });
    client.db.run(
      `INSERT INTO "CustomSearch" ("name", "description", "gain") VALUES ('${name}', '${description}', '${gain}');`
    );

    message.channel.send({
      embeds: [
        new MessageEmbed()
          .setTitle(`Successfully set custom search`)
          .addFields([
            {
              name: "Name",
              value: name,
              inline: true,
            },
            {
              name: "Gain",
              value: gain,
              inline: true,
            },
            {
              name: "Description",
              value: description,
              inline: true,
            },
          ])
          .setColor("GREEN"),
      ],
    });
  },
};
