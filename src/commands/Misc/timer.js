const { MessageEmbed } = require("discord.js");
const replies = require("../../../replies/embedsReplies.json");
const ms = require("ms");

module.exports = {
  name: "timer",
  category: "Misc",
  description: "Sets a timer",
  usage: "timer [duration]",
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

    message.channel.send({
      embeds: [
        new MessageEmbed()
          .setTitle(`Successfully set a timer on ${args[0]}`)
          .setColor("GREEN"),
      ],
    });

    setTimeout(() => {
      message.channel.send({
        embeds: [
          new MessageEmbed()
            .setDescription(`${message.member}🔔Timer is out!`)
            .setColor("GREEN"),
        ],
      });
    }, duration);
  },
};
