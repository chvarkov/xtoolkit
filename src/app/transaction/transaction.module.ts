import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionListComponent } from './components/transaction-list/transaction-list.component';
import { TransactionComponent } from './components/transaction/transaction.component';
import { TransactionStatusBadgeComponent } from './components/transaction-status-badge/transaction-status-badge.component';

@NgModule({
	declarations: [
		TransactionListComponent,
		TransactionComponent,
  TransactionStatusBadgeComponent
	],
	exports: [
		TransactionListComponent
	],
	imports: [
		CommonModule
	]
})
export class TransactionModule { }
