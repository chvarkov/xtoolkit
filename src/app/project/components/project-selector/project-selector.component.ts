import { Component, OnInit } from '@angular/core';
import { SelectElement } from '../../../core/ui/select/select.component';

@Component({
	selector: 'app-project-selector',
	templateUrl: './project-selector.component.html',
	styleUrls: ['./project-selector.component.scss']
})
export class ProjectSelectorComponent implements OnInit {
	mockedData: SelectElement<string>[] = [
		{
			name: 'Maiar DEX',
			value: '1',
		},
		{
			name: 'Airdrop',
			value: '2',
		},
	];

	constructor() {
	}

	ngOnInit(): void {
	}

}
