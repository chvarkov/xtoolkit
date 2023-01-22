import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Clipboard } from '@angular/cdk/clipboard';

@Injectable({
	providedIn: 'root'
})
export class ClipboardService {
	constructor(private readonly toastrService: ToastrService,
				private readonly clipboard: Clipboard) {
	}

	copy(value: string, contentName?: string): void {
		const isCopied = this.clipboard.copy(value);

		isCopied
			? this.toastrService.success(`${contentName || 'Content'} successful copied.`, 'Copied!')
			: this.toastrService.error('Check your browser permissions.', 'Cannot copy')
	}
}
