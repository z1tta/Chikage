const { MessageEmbed } = require("discord.js");
const replies = require("../../../replies/embedsReplies.json");

module.exports = {
  name: "deleterole",
  description: "Deletes a role",
  usage: "deleterole [role]",
  run: async (client, message, args, cooldown) => {
    const noPerm = new MessageEmbed()
      .setTitle(replies.noPerm.title)
      .setColor(replies.noPerm.color);
    if (!message.member.permissions.has("MANAGE_ROLES"))
      return message.channel.send({ embeds: [noPerm] });
    const roleNotMentionned = new MessageEmbed()
      .setTitle(replies.roleNotMentionned.title)
      .setColor(replies.roleNotMentionned.color);
    if (!args[0]) return message.channel.send({ embeds: [roleNotMentionned] });
    if (!args[0].startsWith("<@&") && !args[0].endsWith(">"))
      return message.channel.send({ embeds: [roleNotMentionned] });
    const role = message.guild.roles.cache.get(
      args[0].split("<@&")[1].split(">")[0]
    );
    try {
      message.guild.roles.delete(role);
    } catch (err) {
      const missingHighestRole = new MessageEmbed()
        .setTitle(replies.missingHighestRole.title)
        .setColor(replies.missingHighestRole.color);
      return message.channel.send({ embeds: [missingHighestRole] });
    }
    const successRoleDelete = new MessageEmbed()
      .setTitle(replies.successDeleteRole.title)
      .setDescription(role.name)
      .setColor(replies.successDeleteRole.color);
    await message.channel.send({ embeds: [successRoleDelete] });
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
