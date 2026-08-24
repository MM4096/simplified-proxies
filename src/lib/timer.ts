export function timeout(delay: number) {
    return new Promise( (resolve) => setTimeout(resolve, delay) );
}

export function awaitAnimationFrame(): Promise<void> {
    return new Promise((resolve) => {
        requestAnimationFrame(() => resolve());
    });
}