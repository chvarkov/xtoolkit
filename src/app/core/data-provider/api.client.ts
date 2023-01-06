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

export interface ReleaseInfo {
	version: string;
	isAlpha: boolean;
	isBetta: boolean;
	features: string[];
	bugfixes: string[];
}

@Injectable({providedIn: 'root'})
export class ApiClient {
	private readonly apiUrl = environment.apiUrl;

	constructor(private readonly http: HttpClient) {
	}

	getNews(): Observable<Post[]> {
		return this.http.get<Post[]>(`${this.apiUrl}/news`);
	}

	getReleases(): Observable<ReleaseInfo[]> {
		return this.http.get<ReleaseInfo[]>(`/assets/data/releases.json`);
	}
}
