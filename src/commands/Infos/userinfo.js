const { MessageEmbed } = require("discord.js");
const moment = require("moment");
const replies = require("../../../replies/embedsReplies.json");

module.exports = {
  name: ["userinfo", "ui"],
  category: "Infos",
  description: "Returns informations about the mentionned user",
  usage: "userinfo [memberid]",
  run: async (client, message, args) => {
    const userNotMentionned = new MessageEmbed()
      .setTitle(replies.userNotMentionned.title)
      .setColor(replies.userNotMentionned.color);
    let user = message.guild.members.cache.get(args[0]);
    if (!args[0]) user = message.member;
    const cantFindUser = new MessageEmbed()
      .setTitle(replies.cantFindUser.title)
      .setColor(replies.cantFindUser.color);
    if (!user) return message.channel.send({ embeds: [cantFindUser] });
    const oldnicknames = await new Promise((resolve, reject) =>
      client.db.all(
        `SELECT * FROM "OldNicknames" WHERE "guildid/userid" = '${message.guild.id}/${user.id}';`,
        (err, rows) => (err ? reject(err) : resolve(rows))
      )
    );
    let previousnicknames = "";
    if (oldnicknames.length !== 0) {
      oldnicknames.forEach((nickname) => {
        previousnicknames = previousnicknames + `${nickname.nickname}, `;
      });
      previousnicknames = previousnicknames.slice(
        0,
        previousnicknames.length - 2
      );
    } else {
      previousnicknames = "No previous nicknames";
    }
    const oldusernames = await new Promise((resolve, reject) =>
      client.db.all(
        `SELECT * FROM "OldUsernames" WHERE "userid" = '${user.id}';`,
        (err, rows) => (err ? reject(err) : resolve(rows))
      )
    );
    let previousnames = "";
    if (oldusernames.length !== 0) {
      oldusernames.forEach((username) => {
        previousnames = previousnames + `${username.username}, `;
      });
      previousnames = previousnames.slice(0, previousnames.length - 2);
    } else {
      previousnames = "No previous names";
    }
    const roleslist = user.roles.cache.map((role) => role);
    roleslist.sort((role1, role2) => role2.position - role1.position);
    let roles = "";
    let more = false;
    let i = 0;
    roleslist.forEach((role) => {
      if (role.name == "@everyone") return;
      if (roles.length > 1000) return (more = true);
      roles = roles + `${role}, `;
      i++;
    });
    if (more) roles = roles + `And ${roleslist.length - i}more..., `;
    roles = roles.slice(0, roles.length - 2);
    if (roles.length === 0) roles = "No roles";
    const embed = new MessageEmbed()
      .addFields([
        {
          name: "ID",
          value: `\`${user.id}\``,
        },
        {
          name: "Joined Discord at",
          value: `\`${moment(user.user.createdAt).format("LL")}\``,
          inline: true,
        },
        {
          name: "Joined at",
          value: `\`${moment(user.joinedAt).format("LL")}\``,
          inline: true,
        },
        {
          name: "roles",
          value: roles,
        },
        {
          name: "Previous names",
          value: previousnames,
        },
        {
          name: "Previous nicknames",
          value: previousnicknames,
          inline: true,
        },
      ])
      .setColor("GREEN");

    message.channel.send({ embeds: [embed] });
  },
};
