import { Component, Input, OnInit } from '@angular/core';
import { ReleaseInfo } from '../../../../../core/data-provider/api.client';

@Component({
	selector: 'app-release-info',
	templateUrl: './release-info.component.html',
	styleUrls: ['./release-info.component.scss']
})
export class ReleaseInfoComponent implements OnInit {
	readonly maxLength = 5;

	@Input() release!: ReleaseInfo;

	isFeatureListExpanded = false;
	isBugfixListExpanded = false;

	get features(): string[] {
		return this.isFeatureListExpanded
			? this.release.features
			: this.release.features.slice(0, this.maxLength);
	}

	get bugfixes(): string[] {
		return this.isBugfixListExpanded
			? this.release.bugfixes
			: this.release.bugfixes.slice(0, this.maxLength);
	}

	constructor() {
	}

	ngOnInit(): void {
	}

	expandFeatureList(): void {
		this.isFeatureListExpanded = !this.isBugfixListExpanded;
	}

	expandBugfixList(): void {
		this.isBugfixListExpanded = !this.isBugfixListExpanded;
	}
}
