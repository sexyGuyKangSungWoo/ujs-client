
const { Client } = require("../dist/");

const client = new Client;

(async () => {
    await client.connect("http://127.0.0.1:5555/");
    const node = client.spawnNode({
        dependencies: {},
        alive: false
    });
    node.on("message", message => {
        console.log(message);
    });
    node.exec("sendMessage(1+2)");
})();