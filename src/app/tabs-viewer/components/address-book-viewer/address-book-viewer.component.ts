import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { ProjectAddress } from '../../../core/data-provider/data-provider';
import { ProjectAction } from '../../../project/store/project.action';
import { ProjectSelector } from '../../../project/store/project.selector';

@Component({
	selector: 'app-address-book-viewer',
	templateUrl: './address-book-viewer.component.html',
	styleUrls: ['./address-book-viewer.component.scss']
})
export class AddressBookViewerComponent implements OnInit {
	@Input() projectId: string = '';

	addressBook$?: Observable<ProjectAddress[] | undefined>;

	constructor(private readonly store: Store) {
	}

	ngOnInit(): void {
		this.addressBook$ = this.store.select(ProjectSelector.projectAddresses(this.projectId));
	}

	addAddress(): void {
		this.store.dispatch(ProjectAction.addAddress({projectId: this.projectId}));
	}

	renameAddress(address: string, name: string): void {
		this.store.dispatch(ProjectAction.renameAddress({projectId: this.projectId, address, name}));
	}

	deleteAddress(address: string): void {
		this.store.dispatch(ProjectAction.deleteAddress({projectId: this.projectId, address}));
	}
}
