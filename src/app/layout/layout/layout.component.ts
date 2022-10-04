import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { SplitterSide } from '../../core/ui/resize-vertical-splitter/resize-vertical-splitter.component';
import { Store } from '@ngrx/store';
import { Observable, of, zip } from 'rxjs';
import { LayoutSelector } from '../store/layout.selector';
import { map } from 'rxjs/operators';
import { LayoutAction } from '../store/layout.action';

@Component({
	selector: 'app-layout',
	templateUrl: './layout.component.html',
	styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
	@ViewChild('layout', {static: true}) layoutRef?: ElementRef

	gridTemplateColumns$: Observable<string | undefined> = of();

	constructor(private readonly renderer: Renderer2,
				private readonly store: Store) {
	}

	ngOnInit(): void {
		this.store.dispatch(LayoutAction.loadLayoutState());
		this.gridTemplateColumns$ = this.store.select(LayoutSelector.panelsWidth).pipe(
			map(({left, right}) => `${left}px 1fr ${right}px`),
		);
	}

	resizePanel(side: SplitterSide, dx: number): void {
		if (!this.layoutRef) {
			return;
		}

		let leftPanelWidth = +getComputedStyle(this.layoutRef.nativeElement).gridTemplateColumns?.split(' ')[0].replace('px', '');
		let rightPanelWidth = +getComputedStyle(this.layoutRef.nativeElement).gridTemplateColumns?.split(' ')[2].replace('px', '');

		side === 'left'
			? leftPanelWidth += dx
			: rightPanelWidth -= dx;

		this.store.dispatch(LayoutAction.setLayoutState({
			layoutState: {rightPanelWidth, leftPanelWidth},
		}));
	}
}
