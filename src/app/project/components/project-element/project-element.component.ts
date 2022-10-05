import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProjectComponentType } from '../../../core/types';

@Component({
	selector: 'app-project-element',
	templateUrl: './project-element.component.html',
	styleUrls: ['./project-element.component.scss']
})
export class ProjectElementComponent implements OnInit {
	@Input() name = '';

	@Input() bold = false;

	@Input() expandable = false;

	@Input() isGroup = true;

	@Input() active?: boolean | null;

	@Input() type: ProjectComponentType = 'group';

	@Input() isExpanded: boolean | null = true;

	@Output() click: EventEmitter<void> = new EventEmitter<void>();

	@Output() onExpand: EventEmitter<boolean> = new EventEmitter<boolean>();

	ngOnInit(): void {
	}

	toggleExpand(): void {
		const isExpanded = !(this.isExpanded == null ? true : this.isExpanded);

		this.onExpand.emit(isExpanded);
	}

	onClick(): void {
		if (this.isGroup) {
			return this.toggleExpand();
		}

		this.click.emit();
	}
}
