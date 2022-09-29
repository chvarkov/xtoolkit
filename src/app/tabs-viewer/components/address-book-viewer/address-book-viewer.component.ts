import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { SavedAddress } from '../../../core/data-provider/personal-settings.manager';

@Component({
	selector: 'app-address-book-viewer',
	templateUrl: './address-book-viewer.component.html',
	styleUrls: ['./address-book-viewer.component.scss']
})
export class AddressBookViewerComponent implements OnInit {
	savedAddress$?: Observable<SavedAddress[]> = of([
		{
			projectId: '',
			address: 'erd1ff377y7qdldtsahvt28ec45zkyu0pepuup33adhr8wr2yuelwv7qpevs9e',
			type: 'wallet',
			savedAt: Date.now(),
		},
		{
			projectId: '',
			address: 'erd1ff377y7qdldtsahvt28ec45zkyu0pepuup33adhr8wr2yuelwv7qpevs9e',
			type: 'sc',
			chainId: 'T',
			savedAt: Date.now(),
		},
		{
			projectId: '',
			address: 'erd1ff377y7qdldtsahvt28ec45zkyu0pepuup33adhr8wr2yuelwv7qpevs9e',
			type: 'wallet',
			savedAt: Date.now(),
		},
		{
			projectId: '',
			address: 'erd1ff377y7qdldtsahvt28ec45zkyu0pepuup33adhr8wr2yuelwv7qpevs9e',
			chainId: 'T',
			type: 'sc',
			savedAt: Date.now(),
		},
		{
			projectId: '',
			address: 'erd1ff377y7qdldtsahvt28ec45zkyu0pepuup33adhr8wr2yuelwv7qpevs9e',
			type: 'wallet',
			savedAt: Date.now(),
		},
		{
			projectId: '',
			address: 'erd1ff377y7qdldtsahvt28ec45zkyu0pepuup33adhr8wr2yuelwv7qpevs9e',
			type: 'sc',
			chainId: 'T',
			savedAt: Date.now(),
		},
		{
			projectId: '',
			address: 'erd1ff377y7qdldtsahvt28ec45zkyu0pepuup33adhr8wr2yuelwv7qpevs9e',
			type: 'wallet',
			savedAt: Date.now(),
		},
		{
			projectId: '',
			address: 'erd1ff377y7qdldtsahvt28ec45zkyu0pepuup33adhr8wr2yuelwv7qpevs9e',
			chainId: 'T',
			type: 'sc',
			savedAt: Date.now(),
		},
		{
			projectId: '',
			address: 'erd1ff377y7qdldtsahvt28ec45zkyu0pepuup33adhr8wr2yuelwv7qpevs9e',
			type: 'wallet',
			savedAt: Date.now(),
		},
		{
			projectId: '',
			address: 'erd1ff377y7qdldtsahvt28ec45zkyu0pepuup33adhr8wr2yuelwv7qpevs9e',
			type: 'sc',
			chainId: 'T',
			savedAt: Date.now(),
		},
		{
			projectId: '',
			address: 'erd1ff377y7qdldtsahvt28ec45zkyu0pepuup33adhr8wr2yuelwv7qpevs9e',
			type: 'wallet',
			savedAt: Date.now(),
		},
		{
			projectId: '',
			address: 'erd1ff377y7qdldtsahvt28ec45zkyu0pepuup33adhr8wr2yuelwv7qpevs9e',
			chainId: 'T',
			type: 'sc',
			savedAt: Date.now(),
		},
		{
			projectId: '',
			address: 'erd1ff377y7qdldtsahvt28ec45zkyu0pepuup33adhr8wr2yuelwv7qpevs9e',
			type: 'wallet',
			savedAt: Date.now(),
		},
		{
			projectId: '',
			address: 'erd1ff377y7qdldtsahvt28ec45zkyu0pepuup33adhr8wr2yuelwv7qpevs9e',
			type: 'sc',
			chainId: 'T',
			savedAt: Date.now(),
		},
		{
			projectId: '',
			address: 'erd1ff377y7qdldtsahvt28ec45zkyu0pepuup33adhr8wr2yuelwv7qpevs9e',
			type: 'wallet',
			savedAt: Date.now(),
		},
		{
			projectId: '',
			address: 'erd1ff377y7qdldtsahvt28ec45zkyu0pepuup33adhr8wr2yuelwv7qpevs9e',
			chainId: 'T',
			type: 'sc',
			savedAt: Date.now(),
		},
		{
			projectId: '',
			address: 'erd1ff377y7qdldtsahvt28ec45zkyu0pepuup33adhr8wr2yuelwv7qpevs9e',
			type: 'wallet',
			savedAt: Date.now(),
		},
		{
			projectId: '',
			address: 'erd1ff377y7qdldtsahvt28ec45zkyu0pepuup33adhr8wr2yuelwv7qpevs9e',
			type: 'sc',
			chainId: 'T',
			savedAt: Date.now(),
		},
		{
			projectId: '',
			address: 'erd1ff377y7qdldtsahvt28ec45zkyu0pepuup33adhr8wr2yuelwv7qpevs9e',
			type: 'wallet',
			savedAt: Date.now(),
		},
		{
			projectId: '',
			address: 'erd1ff377y7qdldtsahvt28ec45zkyu0pepuup33adhr8wr2yuelwv7qpevs9e',
			chainId: 'T',
			type: 'sc',
			savedAt: Date.now(),
		},
	]);

	constructor(private readonly store: Store) {
	}

	ngOnInit(): void {
	}

}
