export type WasmOptionalType<TKey extends string> = TKey extends string ? `optional<${TKey}>`: never;

export type WasmStaticType = 'bool' | 'i8' | 'u8' | 'i16' | 'u16' | 'i32' | 'u32' | 'i64' | 'u64' | 'bytes' | 'BigUint' | 'Address';

export type WasmType = WasmStaticType | WasmOptionalType<WasmStaticType | string> | string;

export interface IScAbi {
	name: string;
	constructor: IScConstructor;
	endpoints: IScEndpoint[];
	types: { [name: string]: IScType }
}

export interface IScType {
	type: 'strict',
	fields: IScTypeField[];
}

export interface IScTypeField {
	name: string;
	type: WasmType;
}

export interface IScEndpoint {
	name: string;
	inputs: IScInput[],
	outputs: IScOutput[];
}

export interface IScInput {
	name: string;
	type: WasmType;
	multi_arg?: boolean;
}

export interface IScOutput {
	type: WasmType;
	multi_result?: string;
}

export interface IScConstructor {
	inputs: [],
	outputs: [],
}
