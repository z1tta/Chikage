const { MessageEmbed } = require("discord.js");
const replies = require("../../../replies/embedsReplies.json");

module.exports = {
  name: "lock",
  description: "Locks the channel<",
  usage: "lock",
  run: async (client, message, args) => {
    const noPerm = new MessageEmbed()
      .setTitle(replies.noPerm.title)
      .setColor(replies.noPerm.color);
    if (!message.member.permissions.has("ADMINISTRATOR"))
      return message.channel.send({ embeds: [noPerm] });
    const roles = message.guild.roles.cache.map((r) => r);
    roles.forEach(async (role) => {
      if (!role.permissions.has("ADMINISTRATOR")) {
        await message.channel.permissionOverwrites.edit(role, {
          "SEND_MESSAGES": false,
        });
      }
    });
    const successLock = new MessageEmbed()
      .setTitle(replies.successLock.title)
      .setColor(replies.successLock.color);
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
