const { MessageEmbed } = require("discord.js");
const replies = require("../../../replies/embedsReplies.json");
const { readdirSync } = require("fs");
const categoryList = readdirSync("./src/commands");

module.exports = {
  name: ["help"],
  category: "Misc",
  description: "Sends the help command",
  usage: "help",
  run: async (client, message, args) => {
    const botAdmin = await new Promise((resolve, reject) =>
      client.db.get(
        `SELECT * FROM "BotAdmins" WHERE id = "${message.member.id}"`,
        (err, row) => (err ? reject(err) : resolve(row))
      )
    );
    const prefix = await new Promise((resolve, reject) =>
      client.db.get(
        `SELECT prefix FROM "Guilds" WHERE id = "${message.guild.id}"`,
        (err, row) => (err ? reject(err) : resolve(row.prefix))
      )
    );
    if (!args.length) {
      const embed = new MessageEmbed()
        .setColor("GREEN")
        .addField(
          "Command list",
          `List of all available categories and their commands\nFor more informations, type \`${prefix}help [command name]\``
        );
      categoryList.forEach((category) => {
        if (category == "BotAdmins" && !botAdmin) return;
        if (
          category == "Admins" &&
          !message.member.permissions.has("ADMINISTRATOR")
        )
          return;
        if (
          category == "Moderation" &&
          !message.member.permissions.has("BAN_MEMBERS")
        )
          return;
        if (
          category == "Welcomer" &&
          !message.member.permissions.has("ADMINISTRATOR")
        )
          return;
        embed.addField(
          `${category}`,
          `${client.commands
            .filter((cmd) => cmd.category === category)
            .map((cmd) => cmd.name[0])
            .join(", ")}`
        );
      });
      message.channel.send({ embeds: [embed] });
    } else {
      const cmd = client.commands
        .map((cmd) => cmd)
        .filter((cmd) => cmd.name.includes(args[0]))[0];
      if (!cmd)
        return message.channel.send(
          `\`${args[0]}\` is not a valid command name`
        );
      const embed = new MessageEmbed()
        .setTitle(cmd.name.join(" | "))
        .setDescription(`\`[required]\` / \`(optional)\``)
        .addFields([
          {
            name: "Description",
            value: cmd.description,
          },
          {
            name: "Usage",
            value: `\`${prefix}${cmd.usage.replace("prefix", prefix)}\``,
          },
        ])
        .setColor("GREEN");
      message.channel.send({ embeds: [embed] });
    }
  },
};
