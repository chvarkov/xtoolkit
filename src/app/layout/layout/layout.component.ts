import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { SplitterSide } from '../../core/ui/resize-vertical-splitter/resize-vertical-splitter.component';
import { Store } from '@ngrx/store';
import { Observable, of, Subscription } from 'rxjs';
import { LayoutSelector } from '../store/layout.selector';
import { map } from 'rxjs/operators';
import { LayoutAction } from '../store/layout.action';
import { Theme } from '../../core/data-provider/personal-settings.manager';
import { ThemeSwitcher } from '../services/theme.switcher';
import { environment } from '../../../environments/environment';

@Component({
	selector: 'app-layout',
	templateUrl: './layout.component.html',
	styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, OnDestroy {
	@ViewChild('layout', {static: true}) layoutRef?: ElementRef

	theme$!: Observable<Theme>;

	gridTemplateColumns$: Observable<string | undefined> = of();

	private readonly sub = new Subscription();

	githubUrl = environment.githubLink;
	githubIssuesLink = environment.githubIssuesLink;

	constructor(private readonly renderer: Renderer2,
				private readonly store: Store,
				private readonly themeSwitcher: ThemeSwitcher) {
	}

	ngOnInit(): void {
		this.theme$ = this.store.select(LayoutSelector.theme);
		this.store.dispatch(LayoutAction.loadLayoutState());
		this.gridTemplateColumns$ = this.store.select(LayoutSelector.panelsWidth).pipe(
			map(({left, right}) => ({
				left: Math.max(250, left),
				right: Math.min(window.innerWidth - 250, right),
			})),
			map(({left, right}) => `${left}px calc(100vw - ${right + left}px) ${right}px`),
		);

		this.sub.add(
			this.theme$.subscribe((theme) => this.themeSwitcher.setTheme(theme)),
		);
	}

	ngOnDestroy() {
		this.sub.unsubscribe();
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
