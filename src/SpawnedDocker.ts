
import Spawned from "./Spawned";
import DockerOptions from "./types/DockerOptions";

class SpawnedDocker extends Spawned {
    constructor(socket : SocketIOClient.Socket, token : string, dockerOptions : DockerOptions) {
        super(socket, token);
        this.socket.emit("spawnNode", {
            jwt: "jwt " + token,
            docker: true,
            ...dockerOptions
        });
    }
}

export default SpawnedDocker;