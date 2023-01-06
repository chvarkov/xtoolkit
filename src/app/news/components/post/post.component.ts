import { Component, Input, OnInit } from '@angular/core';
import { Post } from '../../../core/data-provider/api.client';

@Component({
	selector: 'app-post',
	templateUrl: './post.component.html',
	styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
	@Input() data!: Post;

	constructor() {
	}

	ngOnInit(): void {
	}

	open(): void {
		window.open(this.data.url, '_blank');
	}

}
