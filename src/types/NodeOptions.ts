
interface NodeOptions {
    dependencies: {
        [moduleName : string]: string
    },
    alive: boolean
}

export default NodeOptions;