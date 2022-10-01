import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { ProjectAddress } from '../../../core/data-provider/data-provider';
import { ProjectAction } from '../../../project/store/project.action';

@Component({
	selector: 'app-address-book-viewer',
	templateUrl: './address-book-viewer.component.html',
	styleUrls: ['./address-book-viewer.component.scss']
})
export class AddressBookViewerComponent implements OnInit {
	@Input() projectId: string = '';

	savedAddress$?: Observable<ProjectAddress[]> = of([
		{
			projectId: '',
			name: 'Wallet Name',
			address: 'erd1ff377y7qdldtsahvt28ec45zkyu0pepuup33adhr8wr2yuelwv7qpevs9e',
			type: 'wallet',
			savedAt: Date.now(),
		},
		{
			projectId: '',
			name: 'SC Name',
			address: 'erd1ff377y7qdldtsahvt28ec45zkyu0pepuup33adhr8wr2yuelwv7qpevs9e',
			type: 'sc',
			savedAt: Date.now(),
		},
		{
			projectId: '',
			name: 'Wallet Name',
			address: 'erd1ff377y7qdldtsahvt28ec45zkyu0pepuup33adhr8wr2yuelwv7qpevs9e',
			type: 'wallet',
			savedAt: Date.now(),
		},
		{
			projectId: '',
			name: 'SC Name',
			address: 'erd1ff377y7qdldtsahvt28ec45zkyu0pepuup33adhr8wr2yuelwv7qpevs9e',
			type: 'sc',
			savedAt: Date.now(),
		},
		{
			projectId: '',
			name: 'Wallet Name',
			address: 'erd1ff377y7qdldtsahvt28ec45zkyu0pepuup33adhr8wr2yuelwv7qpevs9e',
			type: 'wallet',
			savedAt: Date.now(),
		},
		{
			projectId: '',
			name: 'SC Name',
			address: 'erd1ff377y7qdldtsahvt28ec45zkyu0pepuup33adhr8wr2yuelwv7qpevs9e',
			type: 'sc',
			savedAt: Date.now(),
		},
		{
			projectId: '',
			name: 'Wallet Name',
			address: 'erd1ff377y7qdldtsahvt28ec45zkyu0pepuup33adhr8wr2yuelwv7qpevs9e',
			type: 'wallet',
			savedAt: Date.now(),
		},
		{
			projectId: '',
			name: 'SC Name',
			address: 'erd1ff377y7qdldtsahvt28ec45zkyu0pepuup33adhr8wr2yuelwv7qpevs9e',
			type: 'sc',
			savedAt: Date.now(),
		},
		{
			projectId: '',
			name: 'Wallet Name',
			address: 'erd1ff377y7qdldtsahvt28ec45zkyu0pepuup33adhr8wr2yuelwv7qpevs9e',
			type: 'wallet',
			savedAt: Date.now(),
		},
		{
			projectId: '',
			name: 'SC Name',
			address: 'erd1ff377y7qdldtsahvt28ec45zkyu0pepuup33adhr8wr2yuelwv7qpevs9e',
			type: 'sc',
			savedAt: Date.now(),
		},
		{
			projectId: '',
			name: 'Wallet Name',
			address: 'erd1ff377y7qdldtsahvt28ec45zkyu0pepuup33adhr8wr2yuelwv7qpevs9e',
			type: 'wallet',
			savedAt: Date.now(),
		},
		{
			projectId: '',
			name: 'SC Name',
			address: 'erd1ff377y7qdldtsahvt28ec45zkyu0pepuup33adhr8wr2yuelwv7qpevs9e',
			type: 'sc',
			savedAt: Date.now(),
		},
	]);

	constructor(private readonly store: Store) {
	}

	ngOnInit(): void {
	}

	addAddress(): void {
		this.store.dispatch(ProjectAction.addAddress({projectId: this.projectId}));
	}
}
