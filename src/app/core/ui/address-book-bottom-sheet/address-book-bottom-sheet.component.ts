import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Project, ProjectAddress } from '../../data-provider/data-provider';
import { Observable } from 'rxjs';
import { ProjectSelector } from '../../../project/store/project.selector';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
	selector: 'app-address-book-bottom-sheet',
	templateUrl: './address-book-bottom-sheet.component.html',
	styleUrls: ['./address-book-bottom-sheet.component.scss'],
})
export class AddressBookBottomSheetComponent implements OnInit {
	activeProject$: Observable<Project | undefined>;
	addresses$: Observable<ProjectAddress[]>;

	constructor(private readonly store: Store,
				private readonly bottomSheetRef: MatBottomSheetRef<AddressBookBottomSheetComponent>) {
		this.activeProject$ = this.store.select(ProjectSelector.activeProject());
		this.addresses$ = this.store.select(ProjectSelector.projectAddresses());
	}

	ngOnInit(): void {
	}

	select(address: ProjectAddress): void {
		this.bottomSheetRef.dismiss(address);
	}
}
