const { MessageEmbed } = require("discord.js");
const ms = require("ms");
const replies = require("../../../replies/embedsReplies.json");

module.exports = {
  name: ["prefix"],
  category: "Moderation",
  description: "Set the bot prefix",
  usage: "prefix [newprefix]",
  run: async (client, message, args) => {
    const noPerm = new MessageEmbed()
      .setTitle(replies.noPerm.title)
      .setColor(replies.noPerm.color);
    if (!message.member.permissions.has("ADMINISTRATOR"))
      return message.channel.send({ embeds: [noPerm] });
    const newprefix = args[0];
    if (!newprefix)
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setTitle("Please indicate a new prefix")
            .setColor("RED"),
        ],
      });
    client.db.run(
      `UPDATE "Guilds" SET "prefix" = '${newprefix}' WHERE "id" = '${message.guild.id}';`
    );
    message.channel.send({
      embeds: [
        new MessageEmbed()
          .setTitle(`Successfully set \`${newprefix}\` as prefix`)
          .setColor("GREEN"),
      ],
    });
  },
};
