import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from './ui/toolbar/toolbar.component';
import { SelectComponent } from './ui/select/select.component';
import { TabsComponent } from './ui/tabs/tabs.component';
import { TabComponent } from './ui/tabs/tab/tab.component';
import { ToolbarIconButtonComponent } from './ui/toolbar/toolbar-icon-button/toolbar-icon-button.component';
import { ModalDialogComponent } from './ui/dialog/modal-dialog/modal-dialog.component';
import { ModalDialogFactory } from './ui/dialog/modal-dialog.factory';
import { ConfirmDialogComponent } from './ui/confirm-dialog/confirm-dialog.component';
import { OptionComponent } from './ui/select/option/option.component';

@NgModule({
	declarations: [
		ToolbarComponent,
		SelectComponent,
		TabsComponent,
		TabComponent,
		ToolbarIconButtonComponent,
		ModalDialogComponent,
  ConfirmDialogComponent,
  OptionComponent
	],
    exports: [
        ToolbarComponent,
        SelectComponent,
        TabsComponent,
        TabComponent,
        ToolbarIconButtonComponent,
        ModalDialogComponent,
        OptionComponent,
    ],
	providers: [
		ModalDialogFactory,
	],
	imports: [
		CommonModule
	]
})
export class CoreModule { }
