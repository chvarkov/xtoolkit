import { Component, Input, OnInit } from '@angular/core';
import { ITokenTransfer } from '../../../../core/elrond/interfaces/token-transfer';

@Component({
	selector: 'app-token-transfer',
	templateUrl: './token-transfer.component.html',
	styleUrls: ['./token-transfer.component.scss']
})
export class TokenTransferComponent implements OnInit {
	@Input() ticket = '';

	@Input() chainId = '';

	@Input() transfer?: ITokenTransfer

	constructor() {
	}

	ngOnInit(): void {
	}

}
