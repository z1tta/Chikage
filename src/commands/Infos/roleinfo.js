const { MessageEmbed } = require("discord.js");
const moment = require("moment");
const replies = require("../../../replies/embedsReplies.json");

module.exports = {
  name: "roleinfo",
  category: "Infos",
  description: "Gets informations about a role",
  usage: "roleinfo [roleid]",
  run: async (client, message, args) => {
    const roleNotMentionned = new MessageEmbed()
      .setTitle(replies.roleNotMentionned.title)
      .setColor(replies.roleNotMentionned.color);
    if (!args[0]) return message.channel.send({ embeds: [roleNotMentionned] });
    const role = message.guild.roles.cache.get(args[0]);
    const cantFindRole = new MessageEmbed()
      .setTitle(replies.cantFindRole.title)
      .setColor(replies.cantFindRole.color);
    if (!role) return message.channel.send({ embeds: [cantFindRole] });

    const embed = new MessageEmbed()
      .setTitle(role.name)
      .addFields([
        {
          name: "ID",
          value: role.id,
          inline: true,
        },
        {
          name: "Permissions: ",
          value: `[${role.permissions.bitfield}](https://cogs.fixator10.ru/permissions-calculator/?v=${role.permissions.bitfield})`,
          inline: true,
        },
        {
          name: "Exists since",
          value: `\`${moment(role.createdAt).format("LL")}\``,
          inline: true,
        },
        {
          name: "Color",
          value: role.hexColor,
          inline: true,
        },
        {
          name: "Managed",
          value: role.managed
            .toString()
            .replace("false", "❌")
            .replace("true", "✅"),
          inline: true,
        },
        {
          name: "Hoist",
          value: role.hoist
            .toString()
            .replace("false", "❌")
            .replace("true", "✅"),
          inline: true,
        },
        {
          name: "Mentionable",
          value: role.mentionable
            .toString()
            .replace("false", "❌")
            .replace("true", "✅"),
          inline: true,
        },
        {
          name: "Mention:",
          value: `${role}\n\`${role}\``,
          inline: true,
        },
      ])
      .setColor(role.color);
    message.channel.send({ embeds: [embed] });
  },
};
