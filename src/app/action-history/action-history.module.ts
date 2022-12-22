import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionHistoryListComponent } from './components/action-history-list/action-history-list.component';
import { ActionComponent } from './components/action/action.component';
import { ActionStatusBadgeComponent } from './components/action-status-badge/action-status-badge.component';
import { HttpClientModule } from '@angular/common/http';
import { EffectsModule } from '@ngrx/effects';
import { ActionHistoryEffect } from './store/action-history.effect';
import { StoreModule } from '@ngrx/store';
import { actionHistoryReducer } from './store/action-history.reducer';
import { ACTION_HISTORY_FEATURE } from './constants';
import { CoreModule } from '../core/core.module';

@NgModule({
	imports: [
		CommonModule,
		CoreModule,
		HttpClientModule,
		EffectsModule.forFeature([ActionHistoryEffect]),
		StoreModule.forFeature(ACTION_HISTORY_FEATURE, actionHistoryReducer),
	],
	declarations: [
		ActionHistoryListComponent,
		ActionComponent,
		ActionStatusBadgeComponent,
	],
    exports: [
        ActionHistoryListComponent,
        EffectsModule,
        StoreModule,
    ],
})
export class ActionHistoryModule {
}
