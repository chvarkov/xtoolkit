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

	@Input() type: ProjectComponentType = 'group';

	isExpanded = true;

	@Output() click: EventEmitter<void> = new EventEmitter<void>();

	ngOnInit(): void {
	}

	toggleExpand(): void {
		this.isExpanded = !this.isExpanded;
	}

	onClick(): void {
		if (this.isGroup) {
			return this.toggleExpand();
		}

		this.click.emit();
	}
}
