
import io from "socket.io-client";
import DockerOptions from "./types/DockerOptions";
import NodeOptions from "./types/NodeOptions";
import { Readable } from "stream";

class Client {
    private socket : SocketIOClient.Socket;
    private requestId : 0;
    private requestStreams : Readable[] = [];
    connect(addr : string) {
        const socket = io.connect(addr);

        socket.on("request_data", (requestId : number, data : any) => {
            const stream = this.requestStreams[requestId];
            stream.push(data);
        });
        
        socket.on("request_end", (requestId : number) => {
            const stream = this.requestStreams[requestId];
            stream.push(null);
        });

        this.socket = socket;
    }
    runNode(nodeOptions : NodeOptions) {
        const stream = new Readable();
        this.requestStreams.push(stream);

        const requestId = this.requestId;
        this.requestId++;

        this.socket.emit("runNode", requestId, nodeOptions);

        return stream;
    }
    runDocker(dockerOptions : DockerOptions) {
        const stream = new Readable();
        this.requestStreams.push(stream);

        const requestId = this.requestId;
        this.requestId++;

        this.socket.emit("runNode", requestId, dockerOptions);

        return stream;
    }
}

export default Client;