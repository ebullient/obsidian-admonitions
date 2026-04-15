declare namespace CodeMirror {
    interface Editor {
        getOption(option: string): unknown;
        setOption(option: string, value: unknown): void;
    }
    function defineMode(
        name: string,
        factory: (config: unknown, options: unknown) => unknown,
    ): void;
    function getMode(config: unknown, mode: string | { name: string }): unknown;
    const modes: Record<string, unknown>;
}

declare global {
    interface Window {
        CodeMirror: typeof CodeMirror;
    }
}
