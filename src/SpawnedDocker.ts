
import Spawned from "./Spawned";
import DockerOptions from "./types/DockerOptions";

class SpawnedDocker extends Spawned {
    constructor(spawnId : number, socket : SocketIOClient.Socket, dockerOptions : DockerOptions) {
        super(spawnId, socket);
        this.socket.emit("spawnDocker", spawnId, dockerOptions);
        this.socket.on("spawnDocker_data", (spawnId : number, data : any) => {
            if(spawnId === this.spawnId)
                this.push(data);
        });
        this.socket.on("spawnDocker_close", (spawnId : number) => {
            if(spawnId === this.spawnId)
                this.destroy();
        });
    }
    exec(command : string) {
        this.socket.emit("spawnDocker_exec", this.spawnId, command);
    }
}

export default SpawnedDocker;