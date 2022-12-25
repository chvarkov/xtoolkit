import { Component, Input, OnInit } from '@angular/core';
import { INft } from '../../../../../core/elrond/services/nft';

@Component({
	selector: 'app-ntf-element',
	templateUrl: './ntf-element.component.html',
	styleUrls: ['./ntf-element.component.scss']
})
export class NtfElementComponent implements OnInit {
	@Input() nft!: INft;

	constructor() {
	}

	ngOnInit(): void {
	}

	get background(): string {
		const mediaElem = this.nft.media[0];
		return `url("${mediaElem.thumbnailUrl || mediaElem.url}")`;
	}
}
