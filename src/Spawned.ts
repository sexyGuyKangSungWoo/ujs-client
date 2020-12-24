
import EventEmitter from "wolfy87-eventemitter";

declare interface Spawned extends EventEmitter {
    emit(event: "message", data: any): this;
    emit(event: "start", data: any): this;
    emit(event: "error", data: any): this;
    emit(event: "close", data: any): this;
    emit(event: "stdout", data: any): this;
    emit(event: "stderr", data: any): this;
    emit(event: string | RegExp, ...data: any[]): this;
    on(event: "message", listener: (data: any) => void): this;
    on(event: "start", listener: (data: any) => void): this;
    on(event: "error", listener: (data: any) => void): this;
    on(event: "close", listener: (data: any) => void): this;
    on(event: "stdout", listener: (data: any) => void): this;
    on(event: "stderr", listener: (data: any) => void): this;
    on(event: string | RegExp, listener: Function): this;
    addListener(event: string | RegExp, listener: Function): this;
}

class Spawned extends EventEmitter {
    protected socket : SocketIOClient.Socket;
    protected token: string;
    constructor(socket : SocketIOClient.Socket, token : string) {
        super();
        this.socket = socket;
        this.token = token;
        this.socket.on("spawn_stdout", ({data} : {data : any}) => {
            this.emit("stdout", data);
        });
        this.socket.on("spawn_stderr", ({data} : {data : any}) => {
            this.emit("stderr", data);
        });
        this.socket.on("spawn_close", ({status} : {status : number}) => {
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
    async waitStart() {
        return new Promise<void>(solve => {
            this.socket.once("spawn_start", (message : {status : any, err : any}) => {
                if(message.status !== 200)
                    throw message;
                else
                    solve();
            })
        });
    }
    sendMessage(message : any) {
        this.socket.emit("spawn_message", {
            jwt: "jwt " + this.token,
            message
        });
    }
    exec(command : string) {
        this.socket.emit("spawn_exec", {
            jwt: "jwt " + this.token,
            command
        });
    }
    execF(f : Function) {
        this.exec(`(${f.toString()})()`);
    }
    read(size? : number) {
        return;
    }
}

export default Spawned;