const glob = require("glob");
const { promisify } = require("util");
const pGlob = promisify(glob);

module.exports = async (client) => {
  (await pGlob(`${process.cwd()}/src/commands/*/*.js`)).map(async (cmdFile) => {
    const cmd = require(cmdFile);

    client.commands.set(cmd.name, cmd);
  });
};
