import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Post } from '../../../core/data-provider/api.client';
import { NewsSelector } from '../../store/news.selector';
import { map } from 'rxjs/operators';
import { NewsAction } from '../../store/news.action';

@Component({
	selector: 'app-news-list',
	templateUrl: './news-list.component.html',
	styleUrls: ['./news-list.component.scss']
})
export class NewsListComponent implements OnInit {
	news$: Observable<Post[]>;

	constructor(private readonly store: Store) {
		this.news$ = this.store.select(NewsSelector.news).pipe(map(v => v || []));
	}

	ngOnInit(): void {
		this.loadNews();
	}

	loadNews(): void {
		this.store.dispatch(NewsAction.loadNews());
	}

	trackBy(_: number, v: Post): string {
		return v.id.toString();
	}
}
