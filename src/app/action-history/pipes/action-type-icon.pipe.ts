import { Pipe, PipeTransform } from '@angular/core';
import { ActionType } from '../../core/data-provider/data-provider';

@Pipe({
	name: 'actionTypeIcon',
	pure: true,
})
export class ActionTypeIconPipe implements PipeTransform {

	transform(value: ActionType): string {
		switch (value) {
			case ActionType.Issue:
				return 'token';
			case ActionType.Tx:
				return 'code';
		}
	}
}
