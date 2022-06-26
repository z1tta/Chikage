const { MessageEmbed } = require("discord.js");
const replies = require("../../../replies/embedsReplies.json");

module.exports = {
  name: "unlock",
  description: "Unlocks the channel<",
  usage: "unlock",
  run: async (client, message, args, cooldown) => {
    const noPerm = new MessageEmbed()
      .setTitle(replies.noPerm.title)
      .setColor(replies.noPerm.color);
    if (!message.member.permissions.has("ADMINISTRATOR"))
      return message.channel.send({ embeds: [noPerm] });
    const roles = message.guild.roles.cache.map((r) => r);
    roles.forEach(async (role) => {
      if (!role.permissions.has("ADMINISTRATOR")) {
        await message.channel.permissionOverwrites.edit(role, {
          SEND_MESSAGES: true,
        });
      }
    });
    const successLock = new MessageEmbed()
      .setTitle(replies.successUnlock.title)
      .setColor(replies.successUnlock.color);
    await message.channel.send({ embeds: [successLock] });
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
