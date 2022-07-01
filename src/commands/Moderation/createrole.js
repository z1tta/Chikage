const { MessageEmbed } = require("discord.js");
const replies = require("../../../replies/embedsReplies.json");

module.exports = {
  name: "createrole",
  category: "Moderation",
  description: "Creates a role",
  usage: "createrole [rolename]",
  run: async (client, message, args) => {
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
  },
};
