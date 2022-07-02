const { MessageEmbed } = require("discord.js");
const replies = require("../../../replies/embedsReplies.json");

module.exports = {
  name: ["unlock"],
  category: "Moderation",
  description: "Unlocks the channel<",
  usage: "unlock",
  run: async (client, message, args) => {
    const noPerm = new MessageEmbed()
      .setTitle(replies.noPerm.title)
      .setColor(replies.noPerm.color);
    if (!message.member.permissions.has("ADMINISTRATOR"))
      return message.channel.send({ embeds: [noPerm] });
    const role = message.guild.roles.cache
      .map((r) => r)
      .filter((r) => (r.name = "@everyone"))[0];
    await message.channel.permissionOverwrites.edit(role, {
      SEND_MESSAGES: true,
    });
    const successLock = new MessageEmbed()
      .setTitle(replies.successUnlock.title)
      .setColor(replies.successUnlock.color);
    await message.channel.send({ embeds: [successLock] });
  },
};
