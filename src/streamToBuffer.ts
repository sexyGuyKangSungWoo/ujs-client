
import { Buffer } from "buffer";

function streamToBuffer(stream : any) {
    return new Promise<Buffer>(solve => {
        const result : Array<any> = [];
        stream.on("data", (data : any) => {
            result.push(data);
        });
        stream.on("end", () => {
            solve(Buffer.concat(result));
        })
    });
}

export default streamToBuffer;