
import DockerOptions from "./types/DockerOptions";
import NodeOptions from "./types/NodeOptions";
import SpawnedNode from "./SpawnedNode";
import SpawnedDocker from "./SpawnedDocker";
import streamToBuffer from "./streamToBuffer";

class Client {
    private socket : SocketIOClient.Socket;
    private spawnId = 0;
    private token: string;
    private io : SocketIOClientStatic
    constructor(io : SocketIOClientStatic) {
        this.io = io;
    }
    private async auth(addr : string) {
        const result = await (await fetch(addr+"/auth", {
            method: "POST"
        })).text();
        const token = result;
        this.token = token;
    }
    async connect(addr : string) {
        await this.auth(addr);

        const socket = this.io.connect(addr);
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
        return new SpawnedNode(this.socket, this.token, nodeOptions);
    }
    spawnDocker(dockerOptions : DockerOptions) {
        return new SpawnedDocker(this.socket, this.token, dockerOptions);
    }
}

export default Client;