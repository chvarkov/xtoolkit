import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { GeneratedWallet, ProjectAddress } from '../../../../core/data-provider/data-provider';
import { ProjectSelector } from '../../../../project/store/project.selector';
import { map } from 'rxjs/operators';
import { ITokenTransferOptions } from '../../../../core/elrond/services/wallet.manager';
import { ESDTTransferPayloadBuilder, TokenIdentifierValue, TokenPayment } from '@elrondnetwork/erdjs/out';

@Component({
	selector: 'app-transfer-token-dialog',
	templateUrl: './transfer-token-dialog.component.html',
	styleUrls: ['./transfer-token-dialog.component.scss']
})
export class TransferTokenDialogComponent implements OnInit {
	wallets$?: Observable<GeneratedWallet[]>;

	addressOptions$: Observable<ProjectAddress[]>;

	gasLimit: number = 0;
	amount: string = '0';
	identifier: string = '';
	sender?: GeneratedWallet;
	receiver: string = '';
	txData: string = '';

	get isValid(): boolean {
		return +this.amount > 0 && !!this.identifier && !!this.sender && !!this.receiver;
	}

	get isDisabledData(): boolean {
		return this.identifier !== TokenIdentifierValue.egld().toString();
	}

	constructor(@Inject(MAT_DIALOG_DATA) readonly data: {projectId: string, chainId: string, sender?: string, identifier?: string},
				public readonly dialogRef: MatDialogRef<TransferTokenDialogComponent>,
				public readonly store: Store) {
		this.wallets$ = this.store.select(ProjectSelector.wallets());
		this.addressOptions$ = this.wallets$.pipe(map(list => list.map(w => ({
			projectId: data.projectId,
			name: w.name,
			type: 'wallet',
			address: w.address,
			savedAt: Date.now(),
		}))));
	}

	ngOnInit(): void {
	}

	submit(): void {
		if (!this.isValid) {
			return;
		}

		if (!this.sender) {
			return;
		}

		const data: ITokenTransferOptions = {
			amount: this.amount,
			sender: this.sender.address,
			receiver: this.receiver,
			identifier: this.identifier,
			gasLimit: this.gasLimit,
			wallet: this.sender,
		};

		this.dialogRef.close(data);
	}

	onChangeIdentifier(identifier: string): void {
		this.identifier = identifier;
		this.onUpdateParams();
		this.calculateGasLimit();
	}

	onChangeSender(sender: GeneratedWallet): void {
		this.sender = sender;
	}

	onChangeReceiver(receiver: string): void {
		this.receiver = receiver;
	}

	onChangeAmount(e: Event): void {
		this.amount = (e as unknown as any).target.value;
		this.onUpdateParams();
		this.calculateGasLimit();
	}

	onChangeData(e: Event): void {
		this.txData = (e as unknown as any).target.value;
		this.calculateGasLimit();
	}

	private onUpdateParams(): void {
		if (this.identifier === TokenIdentifierValue.egld().toString()) {
			this.txData = '';
			return;
		}

		const payment = TokenPayment.fungibleFromAmount(
			this.identifier,
			this.amount,
			0,
		);

		this.txData = new ESDTTransferPayloadBuilder().setPayment(payment).build().toString();
	}

	private calculateGasLimit(): void {
		this.gasLimit = 50000 + (1500 * (this.txData?.length || 0));
	}
}
