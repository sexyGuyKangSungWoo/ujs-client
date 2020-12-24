import NodeOptions from "./NodeOptions";

interface DockerOptions extends NodeOptions {
    ports: number[],
    directories: {
        [name: string]: string
    }
}

export default DockerOptions;