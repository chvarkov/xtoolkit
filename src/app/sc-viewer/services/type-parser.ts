import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class TypeParser {

	constructor() {
	}

	isOptional(type: string): boolean {
		return type.indexOf('optional<') === 0 && type[type.length - 1] === '>';
	}

	isArray(type: string): boolean {
		return type.indexOf('variadic<') === 0 && type[type.length - 1] === '>';
	}

	getStructOf(type: string): string {
		return type.split(/<>/)[1];
	}
}
