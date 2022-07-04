module.exports = {
  name: "guildMemberUpdate",
  once: false,
  execute: async (client, oldMember, newMember) => {
    if (oldMember.nickname !== newMember.nickname) {
      const isFrozen = await new Promise((resolve, reject) =>
        client.db.get(
          `SELECT * FROM "FreezeNick" WHERE "userid" = '${newMember.id}';`,
          (err, row) => (err ? reject(err) : resolve(row))
        )
      );
      if (isFrozen) {
        newMember.setNickname(oldMember.nickname);
        client.db.run(
          `DELETE FROM "FreezeNick" WHERE "userid" = '${newMember.id}'`
        );
        setTimeout(() => {
          client.db.run(`INSERT INTO "FreezeNick" VALUES ('${newMember.id}')`);
        }, 1000);
      }

      const oldnicknames = await new Promise((resolve, reject) =>
        client.db.all(
          `SELECT * FROM "OldNicknames" WHERE "guildid/userid" = '${newMember.guild.id}/${newMember.id}';`,
          (err, rows) => (err ? reject(err) : resolve(rows))
        )
      );
      if (!oldMember.nickname) return;
      if (oldnicknames.length !== 0) {
        let order = 0;
        oldnicknames.forEach((oldnickname) => {
          if (oldnickname.order > order) order = oldnickname.order;
        });
        client.db.run(
          `INSERT INTO "OldNicknames" ("guildid/userid", "nickname", "order") VALUES
          ('${newMember.guild.id}/${newMember.id}', '${oldMember.nickname}', '${
            order + 1
          }');`
        );
      } else {
        client.db.run(
          `INSERT INTO "OldNicknames" ("guildid/userid", "nickname", "order") VALUES ('${newMember.guild.id}/${newMember.id}', '${oldMember.nickname}', '1');`
        );
      }
    }
  },
};
