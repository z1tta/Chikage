const { MessageEmbed } = require("discord.js");
const moment = require("moment");
const ms = require("ms");
const replies = require("../../../replies/embedsReplies.json");

module.exports = {
  name: ["serverinfo", "si"],
  category: "Infos",
  description: "Gets informations about the server",
  usage: "serverinfo",
  run: async (client, message, args) => {
    const guild = await client.guilds.fetch(message.guildId);
    let afkchannel = guild.afkChannel;
    if (!afkchannel) afkchannel = "Not set";
    const embed = new MessageEmbed()
      .setTitle(guild.name)
      .setDescription(`Created on \`${moment(guild.createdAt).format("LL")}\` `)
      .addFields([
        {
          name: "Members",
          value: `Users online: **${
            guild.presences.cache.map((p) => p).length
          }/${guild.members.cache.map((m) => m).length}**\nHumans: **${
            guild.members.cache.map((m) => m).filter((m) => m.user.bot !== true)
              .length
          } •** Bots: **${
            guild.members.cache.map((m) => m).filter((m) => m.user.bot == true)
              .length
          }**`,
          inline: true,
        },
        {
          name: "Channels",
          value: `💬Text: **${
            guild.channels.cache
              .map((channel) => channel)
              .filter((channel) => channel.type == "GuildText").length
          }**\n🔊Voice: **${
            guild.channels.cache
              .map((channel) => channel)
              .filter((channel) => channel.type == "GuildVoice").length
          }**`,
          inline: true,
        },
        {
          name: "Utility",
          value: `Owner: **${guild.members.cache.get(
            guild.ownerId
          )}**\nVerif. level: **${guild.verificationLevel}**\nServer ID: **${
            guild.id
          }**`,
        },
        {
          name: "Misc:",
          value: `AFK channel: **${afkchannel}**\nAFK timeout: **${ms(
            guild.afkTimeout * 1000
          )}**\nCustom emojis: **${
            guild.emojis.cache.map((e) => e).length
          }**\nRoles: **${guild.roles.cache.map((r) => r).length}**`,
        },
      ])
      .setColor("GREEN");
    message.channel.send({ embeds: [embed] });
  },
};
