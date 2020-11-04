import { Readable } from "stream";


function streamToBuffer(stream : Readable) {
    return new Promise<Buffer>(solve => {
        const result : Array<any> = [];
        stream.on("data", data => {
            result.push(data);
        });
        stream.on("end", () => {
            solve(Buffer.concat(result));
        })
    });
}

export default streamToBuffer;