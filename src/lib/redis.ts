import {Redis} from "@upstash/redis";
import {timeout} from "@/lib/timer";

const redis = Redis.fromEnv();

/**
 * Awaits a cooldown for a certain key (usually an API key). Redis stores the last time this function was called for
 * that key, and if the time is within the cooldown, it will wait until the cooldown is over.
 * @param key
 * @param cooldown
 * @returns The current time in milliseconds as of the wait finishing.
 */
export async function awaitCooldown(key: string, cooldown: number = 2000) {
	const lastCall = await redis.get(key) as number || 0;
	const currentTime = Date.now();

	if (currentTime - lastCall < cooldown) {
		console.log(`Rate limiting {${key}} for ${currentTime - lastCall}ms`);
		await timeout(cooldown - (currentTime - lastCall));
	}

	await redis.set(key, currentTime.toString());
	return Date.now();
}
