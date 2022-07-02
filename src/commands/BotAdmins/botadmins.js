const { MessageEmbed } = require("discord.js");
const replies = require("../../../replies/embedsReplies.json");

module.exports = {
  name: ["botadmins"],
  category: "BotAdmins",
  description: "Shows a list of bot admins",
  usage: "botadmins",
  run: async (client, message, args) => {
    const isadmin = await new Promise((resolve, reject) =>
      client.db.get(
        `SELECT * FROM "BotAdmins" WHERE "id" = '${message.member.id}';`,
        (err, rows) => (err ? reject(err) : resolve(rows))
      )
    );
    if (!isadmin) return;
    const dbBotAdmins = await new Promise((resolve, reject) =>
      client.db.all(`SELECT * FROM "BotAdmins";`, (err, rows) =>
        err ? reject(err) : resolve(rows)
      )
    );

    const botAdmins = [];
    let owner;

    dbBotAdmins.forEach((admin) => {
      if (admin.owner == "true") owner = admin.id;
      else botAdmins.push(admin.id);
    });

    let admins = "";

    const embed = new MessageEmbed()
      .setTitle("Bot Admins List")
      .addField("Owner", `<@${owner}>`)
      .setColor("GREEN");

    botAdmins.forEach((admin) => {
      admins = admins + `<@${admin}>\n`;
    });
    if (!admins) embed.addField("Admins", "No admins");
    else embed.addField("Admins", admins);
    message.channel.send({ embeds: [embed] });
  },
};
