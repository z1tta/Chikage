const { MessageEmbed } = require("discord.js");
const replies = require("../../../replies/embedsReplies.json");

module.exports = {
  name: "userinfo",
  description: "Returns informations about the mentionned user",
  usage: "",
  run: async (client, message, args, cooldown) => {
    if (cooldown && !message.member.permissions.has("ADMINISTRATOR")) {
      await new Promise((resolve, reject) =>
        client.db.get(
          `INSERT INTO "Cooldown" ("id") VALUES ('${message.member.id}');`,
          (err, row) => (err ? reject(err) : resolve(row))
        )
      );
      setTimeout(async () => {
        await new Promise((resolve, reject) =>
          client.db.get(
            `DELETE FROM "Blacklist" WHERE ("id" = '${message.member.id}');`,
            (err, row) => (err ? reject(err) : resolve(row))
          )
        );
      }, cooldown);
    }
  },
};
