import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { environment } from '../../../../environments/environment';

@Component({
	selector: 'app-donation-dialog',
	templateUrl: './donation-dialog.component.html',
	styleUrls: ['./donation-dialog.component.scss']
})
export class DonationDialogComponent implements OnInit {
	readonly address = environment.donationAddress;
	readonly herotag = environment.donationHerotag;

	constructor(readonly dialogRef: MatDialogRef<DonationDialogComponent>) {
	}

	ngOnInit(): void {
	}

}
