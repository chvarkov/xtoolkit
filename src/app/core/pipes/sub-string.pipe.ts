import { Pipe, PipeTransform } from '@angular/core';

export type SubStrType = 'start' | 'end';

@Pipe({
	name: 'subString'
})
export class SubStringPipe implements PipeTransform {

	transform(value: string, length = 6, type: SubStrType = 'end' ): string {
		if (type === 'end') {
			return (value || '').substring(value.length - length)
		}

		return (value || '').substring(0, length);
	}

}
