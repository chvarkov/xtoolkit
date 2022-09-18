import { Component, Input, OnInit } from '@angular/core';
import { ITokenPosition } from '../../../../core/elrond/interfaces/token-position';

@Component({
	selector: 'app-sc-tokens',
	templateUrl: './sc-tokens.component.html',
	styleUrls: ['./sc-tokens.component.scss']
})
export class ScTokensComponent implements OnInit {
	@Input() positions: ITokenPosition[] = [];

	@Input() native: string  = '0';

	ngOnInit(): void {
	}
}
