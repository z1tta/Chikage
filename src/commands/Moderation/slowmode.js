const { MessageEmbed } = require("discord.js");
const ms = require("ms");
const replies = require("../../../replies/embedsReplies.json");

module.exports = {
  name: "slowmode",
  category: "Moderation",
  description: "Set the slowmode for the channel (0 to reset)",
  usage: "slowmode [duration]",
  run: async (client, message, args) => {
    const noPerm = new MessageEmbed()
      .setTitle(replies.noPerm.title)
      .setColor(replies.noPerm.color);
    if (!message.member.permissions.has("MANAGE_CHANNELS"))
      return message.channel.send({ embeds: [noPerm] });
    const durationMissing = new MessageEmbed()
      .setTitle(replies.durationMissing.title)
      .setColor(replies.durationMissing.color);
    if (!args[0]) return message.channel.send({ embeds: [durationMissing] });
    const duration = ms(args[0]);
    const invalidDuration = new MessageEmbed()
      .setTitle(replies.invalidDuration.title)
      .setColor(replies.invalidDuration.color);
    if (args[0] == "0") {
      message.channel.setRateLimitPerUser(0);
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setTitle(`Successfully reset the slowmode`)
            .setColor("GREEN"),
        ],
      });
    }
    if (!duration) return message.channel.send({ embeds: [invalidDuration] });
    message.channel.setRateLimitPerUser(duration - 1000);
    message.channel.send({
      embeds: [
        new MessageEmbed()
          .setTitle(`Successfully set the slowmode to :`)
          .setDescription(`\`${args[0]}\``)
          .setColor("GREEN"),
      ],
    });
  },
};
