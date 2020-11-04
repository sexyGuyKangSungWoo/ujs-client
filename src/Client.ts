
import io from "socket.io-client";
import DockerOptions from "./types/DockerOptions";
import NodeOptions from "./types/NodeOptions";
import { Readable } from "stream";
import Spawned from "./Spawned";
import SpawnedNode from "./SpawnedNode";
import SpawnedDocker from "./SpawnedDocker";
import streamToBuffer from "./streamToBuffer";

class Client {
    private socket : SocketIOClient.Socket;
    private spawnId = 0;
    async connect(addr : string) {
        const socket = io.connect(addr);
        this.socket = socket;
        await new Promise(solve => {
            socket.once("connect", solve);
        });
    }
    async execNode(nodeOptions : NodeOptions, command : string) {
        const spawnedNode = this.spawnNode(nodeOptions);
        spawnedNode.exec(command);
        return await streamToBuffer(spawnedNode);
    }
    async execDocker(dockerOptions : DockerOptions, command : string) {
        const spawnedDocker = this.spawnDocker(dockerOptions);
        spawnedDocker.exec(command);
        return await streamToBuffer(spawnedDocker);
    }
    spawnNode(nodeOptions : NodeOptions) {
        return new SpawnedNode(this.spawnId++, this.socket, nodeOptions);
    }
    spawnDocker(dockerOptions : DockerOptions) {
        return new SpawnedDocker(this.spawnId++, this.socket, dockerOptions);
    }
}

export default Client;