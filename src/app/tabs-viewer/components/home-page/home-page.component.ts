import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ReleaseInfo } from '../../../core/data-provider/api.client';
import { NewsSelector } from '../../../news/store/news.selector';
import { NewsAction } from '../../../news/store/news.action';

@Component({
	selector: 'app-home-page',
	templateUrl: './home-page.component.html',
	styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
	releasesList$: Observable<ReleaseInfo[]>;

	constructor(private readonly store: Store) {
		this.releasesList$ = this.store.select(NewsSelector.releases)
	}

	ngOnInit(): void {
		this.store.dispatch(NewsAction.loadReleases());
	}
}
