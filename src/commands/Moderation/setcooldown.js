const { MessageEmbed } = require("discord.js");
const ms = require("ms");
const replies = require("../../../replies/embedsReplies.json");

module.exports = {
  name: "setcooldown",
  description: "Set the cooldown for the commands",
  usage: "setcooldown [duration]",
  run: async (client, message, args) => {
    const durationMissing = new MessageEmbed()
      .setTitle(replies.durationMissing.title)
      .setColor(replies.durationMissing.color);
    if (!args[0]) return message.channel.send({ embeds: [durationMissing] });
    const duration = ms(args[0]);
    const invalidDuration = new MessageEmbed()
      .setTitle(replies.invalidDuration.title)
      .setColor(replies.invalidDuration.color);
    if (!duration) return message.channel.send({ embeds: [invalidDuration] });
    client.db.run(
      `UPDATE "Guilds" SET "cooldown" = '${duration}' WHERE "id" = '${message.guild.id}';`
    );
    const successSetCooldown = new MessageEmbed()
      .setTitle(replies.successSetCooldown.title)
      .setDescription(`\`${args[0]}\``)
      .setColor(replies.successSetCooldown.color);
    await message.channel.send({ embeds: [successSetCooldown] });
    if (cooldown && !message.member.permissions.has("ADMINISTRATOR")) {
      await new Promise((resolve, reject) =>
        client.db.get(
          `UPDATE "Users" SET "isInCooldown" = 'true' WHERE "id" = '${message.member.id}'`,
          (err, row) => (err ? reject(err) : resolve(row))
        )
      );
      setTimeout(async () => {
        await new Promise((resolve, reject) =>
          client.db.get(
            `UPDATE "Users" SET "isInCooldown" = 'false' WHERE "id" = '${message.member.id}'`,
            (err, row) => (err ? reject(err) : resolve(row))
          )
        );
      }, cooldown);
    }
  },
};
