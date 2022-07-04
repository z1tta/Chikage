const { MessageEmbed } = require("discord.js");

module.exports = {
  name: ["searchlist"],
  category: "BotAdmins",
  description: "Returns a list of all search activities",
  usage: "searchlist",
  run: async (client, message, args) => {
    const botAdmin = await new Promise((resolve, reject) =>
      client.db.get(
        `SELECT * FROM "BotAdmins" WHERE id = "${message.member.id}"`,
        (err, row) => (err ? reject(err) : resolve(row.id))
      )
    );
    if (!botAdmin) return;

    const searches = await new Promise((resolve, reject) =>
      client.db.all(`SELECT * FROM "CustomSearch";`, (err, rows) =>
        err ? reject(err) : resolve(rows)
      )
    );

    const embed = new MessageEmbed()
      .setTitle(`List of search activities`)
      .setColor("GREEN");
    searches.forEach((search) => {
      embed.addField(
        `${search.name} (${search.gain})`,
        search.description,
        true
      );
    });
    message.channel.send({ embeds: [embed] });
  },
};
