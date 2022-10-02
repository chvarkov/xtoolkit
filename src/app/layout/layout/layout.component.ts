import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { SplitterSide } from '../../core/ui/resize-vertical-splitter/resize-vertical-splitter.component';

@Component({
	selector: 'app-layout',
	templateUrl: './layout.component.html',
	styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
	@ViewChild('layout', {static: true}) layoutRef?: ElementRef

	constructor(private readonly renderer: Renderer2) {
	}

	ngOnInit(): void {
	}

	resizePanel(side: SplitterSide, dx: number): void {
		if (!this.layoutRef) {
			return;
		}

		let leftWidth = +getComputedStyle(this.layoutRef.nativeElement).gridTemplateColumns?.split(' ')[0].replace('px', '');
		let rightWidth = +getComputedStyle(this.layoutRef.nativeElement).gridTemplateColumns?.split(' ')[2].replace('px', '');

		side === 'left'
			? leftWidth += dx
			: rightWidth -= dx;

		this.renderer.setStyle(this.layoutRef.nativeElement, 'grid-template-columns', `${leftWidth}px 1fr ${rightWidth}px`)
	}
}
