const { MessageEmbed } = require("discord.js");
const replies = require("../../../replies/embedsReplies.json");
const ms = require("ms");
const moment = require("moment");

module.exports = {
  name: ["timer"],
  category: "Misc",
  description: "Sets a timer",
  usage: "timer [duration] (name)",
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

    let name = args[1];
    if (!name) name = "Timer";

    const timer = await message.channel.send({
      embeds: [
        new MessageEmbed()
          .setTitle(`Timer`)
          .setDescription(`Stated at \`${moment().format("LLLL")}\``)
          .setFooter({
            text: `Requested by : ${message.author.tag}`,
            iconURL: message.author.avatarURL(),
          })
          .setColor("GREEN"),
      ],
    });

    setTimeout(() => {
      message.channel.send({
        content: `${message.member}`,
        embeds: [
          new MessageEmbed()
            .setTitle(`${message.author.tag}'s Timer!`)
            .setDescription(
              `Your [${name}](https://discord.com/channels/${message.guild.id}/${message.channel.id}/${timer.id}) has ended`
            )
            .setColor("GREEN"),
        ],
      });
      timer.edit({
        embeds: [
          new MessageEmbed().setTitle(`Timer elapsed !`).setColor("GREEN"),
        ],
      });
    }, duration);
  },
};
