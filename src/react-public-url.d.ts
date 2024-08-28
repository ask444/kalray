export { };

declare global {
    interface Window {
        _env_: {
            API_ROOT_URL: string;
            PUBLIC_URL: string;
        }
    }
}
