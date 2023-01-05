import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionHistoryListComponent } from './components/action-history-list/action-history-list.component';
import { ActionComponent } from './components/action/action.component';
import { ActionStatusIconComponent } from './components/action-status-icon/action-status-icon.component';
import { HttpClientModule } from '@angular/common/http';
import { EffectsModule } from '@ngrx/effects';
import { ActionHistoryEffect } from './store/action-history.effect';
import { StoreModule } from '@ngrx/store';
import { actionHistoryReducer } from './store/action-history.reducer';
import { ACTION_HISTORY_FEATURE } from './constants';
import { CoreModule } from '../core/core.module';
import { ActionStatusIconPipe } from './pipes/action-status-icon.pipe';
import { ActionTypeIconPipe } from './pipes/action-type-icon.pipe';
import { ActionTypeIconComponent } from './components/action-type-icon/action-type-icon.component';
import { FieldLabelPipe } from './pipes/field-label.pipe';

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
		ActionStatusIconComponent,
		ActionStatusIconPipe,
		ActionTypeIconPipe,
		FieldLabelPipe,
		ActionTypeIconComponent,
	],
	exports: [
		ActionHistoryListComponent,
		EffectsModule,
		StoreModule,
	],
})
export class ActionHistoryModule {
}
