export function getEnumKeys<
	T extends string,
	TEnumValue extends string | number,
>(enumVariable: { [key in T]: TEnumValue }) {
	return Object.keys(enumVariable) as T[]
}