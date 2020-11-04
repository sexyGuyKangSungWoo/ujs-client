
import Spawned from "./Spawned";
import NodeOptions from "./types/NodeOptions";

class SpawnedNode extends Spawned {
    constructor(spawnId : number, socket : SocketIOClient.Socket, nodeOptions : NodeOptions) {
        super(spawnId, socket);
        this.socket.emit("spawnNode", spawnId, nodeOptions);
        this.socket.on("spawn_data", (spawnId : number, data : any) => {
            if(spawnId === this.spawnId)
                this.push(data);
        });
        this.socket.on("spawn_close", (spawnId : number) => {
            if(spawnId === this.spawnId)
                this.destroy();
        });
    }
    exec(command : string) {
        this.socket.emit("spawnNode_exec", this.spawnId, command);
    }
}

export default SpawnedNode;