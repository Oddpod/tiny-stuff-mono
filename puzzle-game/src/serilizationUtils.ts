interface SerializedMap {
	dataType: "Map";
	value: [unknown, unknown][];
}

function replacer(_: string, value: unknown) {
	if (value instanceof Map) {
		return {
			dataType: "Map",
			value: [...value],
		};
	}
	return value;
}

function reviver(_: string, value: unknown) {
	if (typeof value === "object" && value !== null) {
		const serializedMap = value as SerializedMap;
		if (serializedMap.dataType === "Map") {
			return new Map(serializedMap.value);
		}
	}
	return value;
}

export function serialize<T>(value: T) {
	return JSON.stringify(value, replacer);
}

export function deserialize<T>(value: string) {
	return JSON.parse(value, reviver) as T;
}
