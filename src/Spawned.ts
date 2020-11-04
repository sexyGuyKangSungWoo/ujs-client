

import { Readable } from "stream";

declare interface Spawned {
    on(event: "hello", listener: (name: string) => void): this;
    on(event: string, listener: Function): this;
}

abstract class Spawned extends Readable {
    protected spawnId : number;
    protected socket : SocketIOClient.Socket;
    constructor(execId : number, socket : SocketIOClient.Socket) {
        super();
        this.spawnId = execId;
        this.socket = socket;
    }
    abstract exec(command : string) : void
    read(size? : number) {
        return;
    }
}

export default Spawned;