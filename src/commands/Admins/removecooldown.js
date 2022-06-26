const { MessageEmbed } = require("discord.js");
const ms = require("ms");
const replies = require("../../../replies/embedsReplies.json");

module.exports = {
  name: "removecooldown",
  description: "Removes the cooldown for the commands",
  usage: "removecooldown",
  run: async (client, message, args, cooldown) => {
    const cooldownIsNotSet = new MessageEmbed()
      .setTitle(replies.cooldownIsNotSet.title)
      .setColor(replies.cooldownIsNotSet.color);
    if (!cooldown) return message.channel.send({ embeds: [cooldownIsNotSet] });
    client.db.run(
      `UPDATE "Guilds" SET "cooldown" = '' WHERE "id" = '${message.guild.id}';`
    );
    const successRemoveCooldown = new MessageEmbed()
      .setTitle(replies.successRemoveCooldown.title)
      .setColor(replies.successRemoveCooldown.color);
    await message.channel.send({ embeds: [successRemoveCooldown] });
  },
};
