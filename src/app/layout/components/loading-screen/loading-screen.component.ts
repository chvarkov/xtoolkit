import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
	selector: 'app-loading-screen',
	templateUrl: './loading-screen.component.html',
	styleUrls: ['./loading-screen.component.scss']
})
export class LoadingScreenComponent implements OnInit, OnDestroy {
	text = 'LOADING';

	currentTextValue = '';

	isVisibleCursor = false;

	private currentLetterIndex = -1;

	private textInterval?: NodeJS.Timeout;

	private cursorInterval?: NodeJS.Timeout;

	ngOnInit(): void {
		this.textInterval = setInterval(() => {
			this.currentLetterIndex++;
			const letter = this.text[this.currentLetterIndex];

			if (!letter) {
				clearInterval(this.textInterval);
				this.textInterval = undefined;

				return;
			}

			this.currentTextValue += letter;
		}, 270);

		this.cursorInterval = setInterval(() => {
			this.isVisibleCursor = !this.isVisibleCursor;
		}, 600);
	}

	ngOnDestroy(): void {
		if (this.textInterval) {
			clearInterval(this.textInterval);
		}

		if (this.cursorInterval) {
			clearInterval(this.cursorInterval);
		}
	}
}
