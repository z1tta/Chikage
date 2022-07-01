const { MessageEmbed } = require("discord.js");
const replies = require("../../../replies/embedsReplies.json");

module.exports = {
  name: "ping",
  category: "Misc",
  description: "Shows the latency",
  usage: "ping",
  run: async (client, message, args) => {
    message.channel.send({
      embeds: [
        new MessageEmbed()
          .setTitle(
            `🏓Latency is ${
              Date.now() - message.createdTimestamp
            }ms. API Latency is ${Math.round(client.ws.ping)}ms`
          )
          .setColor("RED"),
      ],
    });
  },
};
