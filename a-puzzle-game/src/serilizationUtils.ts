interface SerializedMap {
	dataType: "Map";
	value: [unknown, unknown][];
}

interface SerializedSet {
	dataType: "Set";
	value: [unknown][];
}

type SerializedMapOrSet = SerializedSet | SerializedMap;

function replacer(_: string, value: unknown) {
	if (value instanceof Map) {
		return {
			dataType: "Map",
			value: [...value],
		};
	}
	if (value instanceof Set) {
		return {
			dataType: "Set",
			value: [...value],
		};
	}
	return value;
}

function reviver(_: string, value: unknown) {
	if (typeof value === "object" && value !== null) {
		const serializedMapOrSet = value as SerializedMapOrSet;
		if (serializedMapOrSet.dataType === "Map") {
			return new Map(serializedMapOrSet.value);
		}
		if (serializedMapOrSet.dataType === "Set") {
			return new Set(serializedMapOrSet.value);
		}
	}
	return value;
}

export function serialize<T>(value: T) {
	return JSON.stringify(value, replacer);
}

export function deserialize<T>(value: string | null) {
	if (!value) throw new Error("Cannot deserialize falsy value");
	return JSON.parse(value, reviver) as T;
}
