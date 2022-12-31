import { Pipe, PipeTransform } from '@angular/core';
import { ActionStatus } from '../../core/data-provider/data-provider';

@Pipe({
	name: 'actionStatusIcon'
})
export class ActionStatusIconPipe implements PipeTransform {

	transform(value: ActionStatus): string {
		switch (value) {
			case ActionStatus.Success:
				return 'check_circle_outline';
			case ActionStatus.Pending:
				return 'cached';
			case ActionStatus.Fail:
				return 'error_outline';
		}
	}

}
