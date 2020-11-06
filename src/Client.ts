
import DockerOptions from "./types/DockerOptions";
import NodeOptions from "./types/NodeOptions";
import SpawnedNode from "./SpawnedNode";
import SpawnedDocker from "./SpawnedDocker";
import streamToBuffer from "./streamToBuffer";
import io from "socket.io-client";

class Client {
    private socket : SocketIOClient.Socket;
    private spawnId = 0;
    private token: string;
    // private io : SocketIOClientStatic
    // constructor(io : SocketIOClientStatic) {
    //     this.io = io;
    // }
    private async auth(addr : string) {
        const result = await (await fetch(addr+"/auth", {
            method: "POST"
        })).text();
        const token = result;
        this.token = token;
    }
    async connect(addr : string = "http://127.0.0.1:2933") {
        await this.auth(addr);

        const socket = io.connect(addr);
        this.socket = socket;
        await new Promise(solve => {
            socket.once("connect", solve);
        });
    }
    async execNode(nodeOptions : NodeOptions, command : string) {
        const spawnedNode = await this.spawnNode(nodeOptions);
        spawnedNode.exec(command);
        return await streamToBuffer(spawnedNode);
    }
    async execDocker(dockerOptions : DockerOptions, command : string) {
        const spawnedDocker = await this.spawnDocker(dockerOptions);
        spawnedDocker.exec(command);
        return await streamToBuffer(spawnedDocker);
    }
    async spawnNode(nodeOptions : NodeOptions) {
        const node = new SpawnedNode(this.socket, this.token, nodeOptions);
        await node.waitStart();
        return node;
    }
    async spawnDocker(dockerOptions : DockerOptions) {
        const docker = new SpawnedDocker(this.socket, this.token, dockerOptions);
        await docker.waitStart();
        return docker;
    }
}

export default Client;