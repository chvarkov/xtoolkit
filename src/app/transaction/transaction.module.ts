import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionListComponent } from './components/transaction-list/transaction-list.component';
import { TransactionComponent } from './components/transaction/transaction.component';
import { TransactionStatusBadgeComponent } from './components/transaction-status-badge/transaction-status-badge.component';
import { TransactionProvider } from './services/transaction.provider';
import { HttpClientModule } from '@angular/common/http';
import { EffectsModule } from '@ngrx/effects';
import { TransactionEffect } from './store/transaction.effect';
import { StoreModule } from '@ngrx/store';
import { transactionReducer } from './store/transaction.reducer';
import { TRANSACTION_FEATURE } from './constants';
import { CoreModule } from '../core/core.module';

@NgModule({
	imports: [
		CommonModule,
		CoreModule,
		HttpClientModule,
		EffectsModule.forFeature([TransactionEffect]),
		StoreModule.forFeature(TRANSACTION_FEATURE, transactionReducer),
	],
	declarations: [
		TransactionListComponent,
		TransactionComponent,
		TransactionStatusBadgeComponent,
	],
	providers: [
		TransactionProvider,
	],
    exports: [
        TransactionListComponent,
        EffectsModule,
        StoreModule,
    ],
})
export class TransactionModule {
}
