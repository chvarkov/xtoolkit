import { Pipe, PipeTransform } from '@angular/core';
import { ActionType } from '../../core/data-provider/data-provider';

@Pipe({
	name: 'actionTypeIcon',
})
export class ActionTypeIconPipe implements PipeTransform {

	transform(value: ActionType): string {
		switch (value) {
			case ActionType.Issue:
				return 'token';
			case ActionType.Query:
				return 'switch_access_shortcut';
			case ActionType.Tx:
				return 'code';
		}
	}
}
