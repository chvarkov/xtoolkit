import {
	Component,
	ContentChildren,
	ElementRef,
	HostListener,
	Input,
	QueryList,
	ViewChild
} from '@angular/core';
import { OptionComponent } from '../select/option/option.component';
import { DropdownMenuItemComponent } from './dropdown-menu-item/dropdown-menu-item.component';

@Component({
	selector: 'app-dropdown-menu',
	templateUrl: './dropdown-menu.component.html',
	styleUrls: ['./dropdown-menu.component.scss']
})
export class DropdownMenuComponent {
	@ContentChildren(OptionComponent) options?: QueryList<DropdownMenuItemComponent>;
	@ViewChild('dropdown', {static: true}) selfRef?: ElementRef;

	isOpen = false;

	@Input() icon = '';
	@Input() horizontal:'left' | 'right' = 'right';
	@Input() vertical: 'top' | 'bottom' = 'bottom';

	switchShowOptions(e: Event): void {
		e.stopPropagation();
		this.isOpen = !this.isOpen;
	}
}
