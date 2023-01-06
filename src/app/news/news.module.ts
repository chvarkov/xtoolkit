import { CoreModule } from '../core/core.module';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { NEWS_FEATURE } from './constants';
import { NewsListComponent } from './components/news-list/news-list.component';
import { PostComponent } from './components/post/post.component';
import { NewsEffect } from './store/news.effect';
import { newsReducer } from './store/news.reducer';
import { CommonModule } from '@angular/common';

@NgModule({
	imports: [
		CommonModule,
		CoreModule,
		StoreModule.forFeature(NEWS_FEATURE, newsReducer),
		EffectsModule.forFeature([NewsEffect]),
	],
	declarations: [
		NewsListComponent,
		PostComponent,
	],
	exports: [
		NewsListComponent,
		PostComponent,
	]
})
export class NewsModule { }
