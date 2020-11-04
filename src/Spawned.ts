

import { Readable } from "stream";

declare interface Spawned {
    emit(event: "message", data: any): boolean;
    emit(event: "start", data: any): boolean;
    emit(event: "error", data: any): boolean;
    emit(event: "close", data: any): boolean;
    emit(event: string, ...data: any[]): boolean;
    on(event: "message", listener: (data: any) => void): this;
    on(event: "start", listener: (data: any) => void): this;
    on(event: "error", listener: (data: any) => void): this;
    on(event: "close", listener: (data: any) => void): this;
    on(event: string, listener: Function): this;
}

class Spawned extends Readable {
    protected socket : SocketIOClient.Socket;
    protected token: string;
    constructor(socket : SocketIOClient.Socket, token : string) {
        super();
        this.socket = socket;
        this.token = token;
        this.socket.on("spawn_data", ({data} : {data : any}) => {
            this.push(data);
        });
        this.socket.on("spawn_close", ({status} : {status : number}) => {
            this.destroy();
            this.emit("close", status);
        });
        this.socket.on("spawn_message", ({message} : {message : any}) => {
            this.emit("message", message);
        });
        this.socket.on("spawn_start", ({status} : {status : any}) => {
            this.emit("start", status);
        });
        this.socket.on("spawn_error", ({err} : {err : any}) => {
            this.emit("error", err);
        });
    }
    message(message : any) {
        this.socket.emit("spawn_message", {
            jwt: this.token,
            message
        });
    }
    exec(command : string) {
        this.socket.emit("spawn_exec", {
            jwt: this.token,
            command
        });
    }
    read(size? : number) {
        return;
    }
}

export default Spawned;