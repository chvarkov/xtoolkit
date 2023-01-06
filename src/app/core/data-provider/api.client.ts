import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Post {
	id: number;
	hash: string;
	title: string;
	image: string;
	url: string;
	readInMin: number;
	publishedAt: string;
}

@Injectable({providedIn: 'root'})
export class ApiClient {
	private readonly apiUrl = environment.apiUrl;

	constructor(private readonly http: HttpClient) {
	}

	getNews(): Observable<Post[]> {
		return this.http.get<Post[]>(`${this.apiUrl}/news`);
	}
}
