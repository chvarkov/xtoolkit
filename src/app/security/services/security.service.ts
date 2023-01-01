import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class SecurityService {
	private readonly salt = 'c3c62ea42d6ad4ac7506b60ff1851f4c';


}
