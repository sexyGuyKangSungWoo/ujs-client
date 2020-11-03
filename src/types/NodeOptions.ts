
interface NodeOptions {
    dependencies: {
        [moduleName : string]: string
    },
    code: string
}

export default NodeOptions;