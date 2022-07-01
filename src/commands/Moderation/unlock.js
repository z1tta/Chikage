const { MessageEmbed } = require("discord.js");
const replies = require("../../../replies/embedsReplies.json");

module.exports = {
  name: "unlock",
  category: "Moderation",
  description: "Unlocks the channel<",
  usage: "unlock",
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
          SEND_MESSAGES: true,
        });
      }
    });
    const successLock = new MessageEmbed()
      .setTitle(replies.successUnlock.title)
      .setColor(replies.successUnlock.color);
    await message.channel.send({ embeds: [successLock] });
  },
};
