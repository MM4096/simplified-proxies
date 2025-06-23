export function timeout(delay: number) {
    return new Promise( res => setTimeout(res, delay) );
}