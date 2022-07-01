module.exports = {
  name: "userUpdate",
  once: false,
  execute: async (client, oldUser, newUser) => {
    if (oldUser.username !== newUser.username) {
      const oldusernames = await new Promise((resolve, reject) =>
        client.db.all(
          `SELECT * FROM "OldUsernames" WHERE "userid" = '${newUser.id}';`,
          (err, rows) => (err ? reject(err) : resolve(rows))
        )
      );
      if (!oldUser.username) return;
      if (oldusernames.length !== 0) {
        let order = 0;
        oldusernames.forEach((oldusername) => {
          if (oldusername.order > order) order = oldusername.order;
        });
        client.db.run(
          `INSERT INTO "OldUsernames" ("userid", "username", "order") VALUES ('${newUser.id}', '${oldUser.username}', '${order + 1}');`
        );
      } else {
        client.db.run(
          `INSERT INTO "OldUsernames" ("userid", "username", "order") VALUES ('${newUser.id}', '${oldUser.username}', '1');`
        );
      }
    }
  },
};
