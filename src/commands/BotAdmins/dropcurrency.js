const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const replies = require("../../../replies/embedsReplies.json");

module.exports = {
  name: "dropcurrency",
  category: "BotAdmins",
  description:
    "Drop an amount of money in the channel, the first member who will click on the button will receive this amount",
  usage: "dropcurrecy [amount]",
  run: async (client, message, args) => {
    const botAdmin = await new Promise((resolve, reject) =>
      client.db.get(
        `SELECT * FROM "BotAdmins" WHERE id = "${message.member.id}"`,
        (err, row) => (err ? reject(err) : resolve(row.id))
      )
    );
    if (!botAdmin) return;
    const amount = parseInt(args[0]);
    if (!amount)
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setTitle(`Please indicate an amount`)
            .setColor("RED"),
        ],
      });
    if (isNaN(amount))
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setTitle(`Please indicate a valid amount`)
            .setColor("RED"),
        ],
      });
    const dropmessage = await message.channel.send({
      embeds: [
        new MessageEmbed()
          .setTitle(`Currency drop !`)
          .setDescription(`Click on the button to receive \`${amount}\``)
          .setColor("GREEN"),
      ],
    });
    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId(dropmessage.id)
        .setLabel(`Click`)
        .setStyle("SUCCESS")
    );
    dropmessage.edit({
      embeds: [
        new MessageEmbed()
          .setTitle(`Currency drop !`)
          .setDescription(`Click on the button to receive \`${amount}\``)
          .setColor("GREEN"),
      ],
      components: [row],
    });
    client.db.run(
      `INSERT INTO "DropcurrencyButtons" ("id", "amount") VALUES ('${dropmessage.id}', '${amount}')`
    );
  },
};
