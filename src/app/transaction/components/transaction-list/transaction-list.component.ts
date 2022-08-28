import { Component, Input, OnInit } from '@angular/core';
import { ITransactionPreview } from '../../interfaces/transaction-preview';
import { TransactionStatus } from '../../enums/transaction-status';

@Component({
	selector: 'app-transaction-list',
	templateUrl: './transaction-list.component.html',
	styleUrls: ['./transaction-list.component.scss']
})
export class TransactionListComponent implements OnInit {

	@Input() list: ITransactionPreview[] = [
		{
			hash: '0FD55AFF4...AFF4DFA67',
			status: TransactionStatus.Pending,
			amount: '0.1',
			initiator: 'User1',
			calledSc: 'PoolSc',
			function: 'Delegate',
			assetName: 'xEGLD',
			assetIcon: 'https://media.elrond.com/tokens/asset/WEGLD-bd4d79/logo.svg'
		},
		{
			hash: '0FD55AFF4...AFF4DFA67',
			status: TransactionStatus.Completed,
			amount: '0.1',
			initiator: 'User1',
			calledSc: 'PoolSc',
			function: 'Delegate',
			assetName: 'xEGLD',
			assetIcon: 'https://media.elrond.com/tokens/asset/WEGLD-bd4d79/logo.svg'
		},
		{
			hash: '0FD55AFF4...AFF4DFA67',
			status: TransactionStatus.Completed,
			amount: '0.1',
			initiator: 'User1',
			calledSc: 'PoolSc',
			function: 'Delegate',
			assetName: 'xEGLD',
			assetIcon: 'https://media.elrond.com/tokens/asset/WEGLD-bd4d79/logo.svg'
		},
		{
			hash: '0FD55AFF4...AFF4DFA67',
			status: TransactionStatus.Failed,
			amount: '0.1',
			initiator: 'User1',
			calledSc: 'PoolSc',
			function: 'Delegate',
			assetName: 'xEGLD',
			assetIcon: 'https://media.elrond.com/tokens/asset/WEGLD-bd4d79/logo.svg'
		},
		{
			hash: '0FD55AFF4...AFF4DFA67',
			status: TransactionStatus.Completed,
			amount: '0.1',
			initiator: 'User1',
			calledSc: 'PoolSc',
			function: 'Delegate',
			assetName: 'xEGLD',
			assetIcon: 'https://media.elrond.com/tokens/asset/WEGLD-bd4d79/logo.svg'
		},
		{
			hash: '0FD55AFF4...AFF4DFA67',
			status: TransactionStatus.Completed,
			amount: '0.1',
			initiator: 'User1',
			calledSc: 'PoolSc',
			function: 'Delegate',
			assetName: 'xEGLD',
			assetIcon: 'https://media.elrond.com/tokens/asset/WEGLD-bd4d79/logo.svg'
		},
		{
			hash: '0FD55AFF4...AFF4DFA67',
			status: TransactionStatus.Completed,
			amount: '0.1',
			initiator: 'User1',
			calledSc: 'PoolSc',
			function: 'Delegate',
			assetName: 'xEGLD',
			assetIcon: 'https://media.elrond.com/tokens/asset/WEGLD-bd4d79/logo.svg'
		},
		{
			hash: '0FD55AFF4...AFF4DFA67',
			status: TransactionStatus.Completed,
			amount: '0.1',
			initiator: 'User1',
			calledSc: 'PoolSc',
			function: 'Delegate',
			assetName: 'xEGLD',
			assetIcon: 'https://media.elrond.com/tokens/asset/WEGLD-bd4d79/logo.svg'
		},
		{
			hash: '0FD55AFF4...AFF4DFA67',
			status: TransactionStatus.Completed,
			amount: '0.1',
			initiator: 'User1',
			calledSc: 'PoolSc',
			function: 'Delegate',
			assetName: 'xEGLD',
			assetIcon: 'https://media.elrond.com/tokens/asset/WEGLD-bd4d79/logo.svg'
		},
		{
			hash: '0FD55AFF4...AFF4DFA67',
			status: TransactionStatus.Completed,
			amount: '0.1',
			initiator: 'User1',
			calledSc: 'PoolSc',
			function: 'Delegate',
			assetName: 'xEGLD',
			assetIcon: 'https://media.elrond.com/tokens/asset/WEGLD-bd4d79/logo.svg'
		},
		{
			hash: '0FD55AFF4...AFF4DFA67',
			status: TransactionStatus.Completed,
			amount: '0.1',
			initiator: 'User1',
			calledSc: 'PoolSc',
			function: 'Delegate',
			assetName: 'xEGLD',
			assetIcon: 'https://media.elrond.com/tokens/asset/WEGLD-bd4d79/logo.svg'
		},
		{
			hash: '0FD55AFF4...AFF4DFA67',
			status: TransactionStatus.Completed,
			amount: '0.1',
			initiator: 'User1',
			calledSc: 'PoolSc',
			function: 'Delegate',
			assetName: 'xEGLD',
			assetIcon: 'https://media.elrond.com/tokens/asset/WEGLD-bd4d79/logo.svg'
		},
		{
			hash: '0FD55AFF4...AFF4DFA67',
			status: TransactionStatus.Completed,
			amount: '0.1',
			initiator: 'User1',
			calledSc: 'PoolSc',
			function: 'Delegate',
			assetName: 'xEGLD',
			assetIcon: 'https://media.elrond.com/tokens/asset/WEGLD-bd4d79/logo.svg'
		},
		{
			hash: '0FD55AFF4...AFF4DFA67',
			status: TransactionStatus.Completed,
			amount: '0.1',
			initiator: 'User1',
			calledSc: 'PoolSc',
			function: 'Delegate',
			assetName: 'xEGLD',
			assetIcon: 'https://media.elrond.com/tokens/asset/WEGLD-bd4d79/logo.svg'
		},
		{
			hash: '0FD55AFF4...AFF4DFA67',
			status: TransactionStatus.Completed,
			amount: '0.1',
			initiator: 'User1',
			calledSc: 'PoolSc',
			function: 'Delegate',
			assetName: 'xEGLD',
			assetIcon: 'https://media.elrond.com/tokens/asset/WEGLD-bd4d79/logo.svg'
		},
		{
			hash: '0FD55AFF4...AFF4DFA67',
			status: TransactionStatus.Completed,
			amount: '0.1',
			initiator: 'User1',
			calledSc: 'PoolSc',
			function: 'Delegate',
			assetName: 'xEGLD',
			assetIcon: 'https://media.elrond.com/tokens/asset/WEGLD-bd4d79/logo.svg'
		},
	]

	constructor() {
	}

	ngOnInit(): void {
	}

}
