import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

export type ProjectElementType = 'project' | 'group' | 'sc' | 'token' | 'nft' | 'wallet';

@Component({
	selector: 'app-project-element',
	templateUrl: './project-element.component.html',
	styleUrls: ['./project-element.component.scss']
})
export class ProjectElementComponent implements OnInit {
	@Input() name = '';

	@Input() icon = '';

	@Input() bold = false;

	@Input() expandable = false;

	@Input() isGroup = true;

	@Input() type: ProjectElementType = 'group';

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

	getColor(): string {
		switch (this.type) {
			case 'project':
				return '#FFF';
			case 'sc':
				return '#7effbd';
			case 'token':
				return '#fddf79';
			case 'wallet':
				return '#0FF0FF';
			case 'nft':
				return '#e37ef3';
			case 'group':
				return '#EDEDED';
		}
	}
}
