import { Component, Input, OnInit } from '@angular/core';
import { INetworkEnvironment } from '../../../core/interfaces/network-environment';
import { ProjectScAbi } from '../../../core/data-provider/data-provider';

@Component({
	selector: 'app-sc-viewer',
	templateUrl: './sc-viewer.component.html',
	styleUrls: ['./sc-viewer.component.scss'],
})
export class ScViewerComponent implements OnInit {
	@Input() address: string = '';

	@Input() selectedEnvironment?: INetworkEnvironment;

	@Input() selectedSc?: ProjectScAbi | null;

	@Input() code: string = '';

	ngOnInit(): void {
	}
}
