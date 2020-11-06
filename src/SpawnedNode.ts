
import Spawned from "./Spawned";
import NodeOptions from "./types/NodeOptions";

class SpawnedNode extends Spawned {
    constructor(socket : SocketIOClient.Socket, token : string, nodeOptions : NodeOptions) {
        super(socket, token);
        this.socket.emit("spawnNode", {
            jwt: "jwt " + token,
            ...nodeOptions
        });
    }
}

export default SpawnedNode;