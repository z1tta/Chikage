const { MessageEmbed } = require("discord.js");
const replies = require("../../../replies/embedsReplies.json");

module.exports = {
  name: "setstatus",
  description: "Sets the bot's status",
  usage:
    "setstatus [online || idle || invisible || dnd] (competing || playing || listening || watching) (activityname)",
  run: async (client, message, args, cooldown) => {
    const botAdmin = await new Promise((resolve, reject) =>
      client.db.get(
        `SELECT * FROM "BotAdmins" WHERE id = "${message.member.id}"`,
        (err, row) => (err ? reject(err) : resolve(row.id))
      )
    );
    if (!botAdmin) return;
    const statusNotIndicate = new MessageEmbed()
      .setTitle(replies.statusNotMentionned.title)
      .setColor(replies.statusNotMentionned.color);
    if (!args[0]) return message.channel.send({ embeds: [statusNotIndicate] });
    const status = args[0];
    if (
      status != "online" &&
      status != "idle" &&
      status != "invisible" &&
      status != "dnd"
    )
      return message.channel.send({ embeds: [statusNotIndicate] });
    let activityName = "";
    let activityType;
    if (args[1]) {
      if (
        args[1] !== "competing" &&
        args[1] !== "playing" &&
        args[1] !== "listening" &&
        args[1] !== "watching"
      ) {
        return message.channel.send({
          embeds: [
            new MessageEmbed()
              .setTitle(`Please enter a valid activity type`)
              .setColor("RED"),
          ],
        });
      }
      if (!args[2])
        return message.channel.send({
          embeds: [
            new MessageEmbed()
              .setTitle(`Please enter a valid activity name`)
              .setColor("RED"),
          ],
        });
      activityType = args[1].toUpperCase();
      args.forEach((arg) => {
        if (arg !== args[0] && arg !== args[1])
          activityName = activityName + arg + " ";
      });
    }
    if (activityName) {
      await client.user.setPresence({
        activities: [
          {
            name: activityName,
            type: activityType,
          },
        ],
        status: status,
      });
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setTitle("Successfuly set status and activity")
            .setColor("GREEN"),
        ],
      });
    } else {
      await client.user.setPresence({
        status: status,
      });
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setTitle("Successfuly set status")
            .setColor("GREEN"),
        ],
      });
    }
    if (cooldown && !message.member.permissions.has("ADMINISTRATOR")) {
      await new Promise((resolve, reject) =>
        client.db.get(
          `UPDATE "Users" SET "isInCooldown" = 'true' WHERE "id" = '${message.member.id}'`,
          (err, row) => (err ? reject(err) : resolve(row))
        )
      );
      setTimeout(async () => {
        await new Promise((resolve, reject) =>
          client.db.get(
            `UPDATE "Users" SET "isInCooldown" = 'false' WHERE "id" = '${message.member.id}'`,
            (err, row) => (err ? reject(err) : resolve(row))
          )
        );
      }, cooldown);
    }
  },
};
