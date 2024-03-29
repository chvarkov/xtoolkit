import {
	Address,
	AddressType,
	AddressValue,
	BigIntType,
	BigIntValue,
	BigUIntType,
	BigUIntValue,
	BytesType,
	BytesValue, EndpointDefinition,
	EndpointParameterDefinition,
	EnumType,
	EnumValue, Field,
	I16Type,
	I16Value,
	I32Type,
	I32Value,
	I64Type,
	I64Value,
	I8Type,
	I8Value,
	SmartContract, Struct, StructType,
	TokenIdentifierType,
	TokenIdentifierValue,
	TypedValue,
	U16Type,
	U16Value,
	U32Type,
	U32Value,
	U64Type,
	U64Value,
	U8Type,
	U8Value
} from '@multiversx/sdk-core/out';
import BigNumber from 'bignumber.js';

export class ScArgsBuilder {
	constructor(private readonly sc: SmartContract) {
	}

	build(functionName: string, payload: Record<string, any>): TypedValue[] {
		const endpoint = this.sc.getEndpoint(functionName);

		return ScArgsBuilder.buildFromEndpointDefinition(endpoint, payload)
	}

	static buildFromEndpointDefinition(endpointDefinition: EndpointDefinition, payload: Record<string, any>): TypedValue[] {
		const args = endpointDefinition.input.map((input): TypedValue | null => {
			const value = payload[input.name];

			return this.transformToTypedValue(input, value);
		});

		return args.filter((i) => !!i) as TypedValue[];
	}

	static transformToTypedValue(input: EndpointParameterDefinition, value?: any): TypedValue | null {
		console.log(`transform_value[${input.type.getClassName()}]`, value)

		switch (input.type.getClassName()) {
			case I8Type.ClassName:
				return new I8Value(value || 0);
			case U8Type.ClassName:
				return new U8Value(value || 0);
			case I16Type.ClassName:
				return new I16Value(value || 0);
			case U16Type.ClassName:
				return new U16Value(value || 0);
			case I32Type.ClassName:
				return new I32Value(value || 0);
			case U32Type.ClassName:
				return new U32Value(value || 0);
			case I64Type.ClassName:
				return new I64Value(value || 0);
			case U64Type.ClassName:
				return new U64Value(value || 0);
			case BigIntType.ClassName:
				return new BigIntValue(new BigNumber(value || 0));
			case BigUIntType.ClassName:
				return new BigUIntValue(new BigNumber(value || 0));
			case BytesType.ClassName:
				return new BytesValue(value || Buffer.from([]));
			case AddressType.ClassName:
				return new AddressValue(new Address(value));
			case TokenIdentifierType.ClassName:
				return new TokenIdentifierValue(value);
			case EnumType.ClassName:
				return EnumValue.fromDiscriminant(input.type as EnumType, value);
			case StructType.ClassName:
				const structType = input.type as StructType;
				return new Struct(structType, Object.keys(value || {}).map(name => {
					const fieldValue = (value || {})[name];
					const fieldDef = structType.getFieldDefinition(name);

					if (!fieldDef) {
						throw new Error(`Field definition not found (${name})`);
					}

					const builtValue = this.transformToTypedValue(fieldDef, fieldValue);

					if (!builtValue) {
						throw new Error(`Cannot build value (${name}=${fieldValue.toString()})`);
					}

					return new Field(builtValue, name);
				}))
			// TODO: Describe all types
			default:
				console.warn(`Cannot resolve typed value for ${input.type.getClassName()} type`);
				return null;
		}
	}
}
