const { MessageEmbed } = require("discord.js");
const replies = require("../../../replies/embedsReplies.json");

module.exports = {
  name: "createrole",
  description: "Creates a role",
  usage: "createrole [rolename]",
  run: async (client, message, args, cooldown) => {
    const noPerm = new MessageEmbed()
      .setTitle(replies.noPerm.title)
      .setColor(replies.noPerm.color);
    if (!message.member.permissions.has("MANAGE_ROLES"))
      return message.channel.send({ embeds: [noPerm] });
    const roleNameNotMentionned = new MessageEmbed()
      .setTitle(replies.roleNameNotMentionned.title)
      .setColor(replies.roleNameNotMentionned.color);
    if (!args[0])
      return message.channel.send({ embeds: [roleNameNotMentionned] });
    const role = await message.guild.roles.create({
      name: args[0],
    });
    const successCreateRole = new MessageEmbed()
      .setTitle(replies.successAddRole.title)
      .setDescription(`${role}`)
      .setColor(replies.successCreateRole.color);
    await message.channel.send({ embeds: [successCreateRole] });
    if (cooldown && !message.member.permissions.has("ADMINISTRATOR")) {
      await new Promise((resolve, reject) =>
        client.db.get(
          `INSERT INTO "Cooldown" ("id") VALUES ('${message.member.id}');`,
          (err, row) => (err ? reject(err) : resolve(row))
        )
      );
      setTimeout(async () => {
        await new Promise((resolve, reject) =>
          client.db.get(
            `DELETE FROM "Cooldown" WHERE ("id" = '${message.member.id}');`,
            (err, row) => (err ? reject(err) : resolve(row))
          )
        );
      }, cooldown);
    }
  },
};
