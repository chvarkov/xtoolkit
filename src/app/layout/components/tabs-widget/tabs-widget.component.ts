import {
	AfterViewInit,
	Component,
	ContentChildren,
	Input,
	OnInit,
	QueryList,
} from '@angular/core';
import { WidgetTabComponent } from './widget-tab/widget-tab.component';

@Component({
	selector: 'app-tabs-widget',
	templateUrl: './tabs-widget.component.html',
	styleUrls: ['./tabs-widget.component.scss']
})
export class TabsWidgetComponent implements OnInit, AfterViewInit {
	@Input() activeId?: string;

	@ContentChildren(WidgetTabComponent) tabs?: QueryList<WidgetTabComponent>;

	get length(): number {
		return this.tabs?.length || 0;
	}

	constructor() {
	}

	ngOnInit(): void {

	}

	ngAfterViewInit() {
		setTimeout(() => {
			const first = this.tabs?.first;

			if (first) {
				first.active = true;
				this.activeId = first.id;
			}
		}, 0);
	}

	openByIndex(index: number): void {
		const tab = this.tabs?.get(index);

		if (tab) {
			this.select(tab.id)
		}
	}

	select(id: string): void {
		setTimeout(() => {
			if (id !== this.activeId) {
				const tabs = this.tabs?.toArray() || [];
				if (tabs.length) {
					const activeTab = tabs.find(t => t.id === id);

					if (activeTab) {
						activeTab.active = true;
					}

					const prevTab = tabs.find(t => t.id === this.activeId);

					if (prevTab) {
						prevTab.active = false;
					}

					this.activeId = id;
				}
			}
		}, 0);
	}
}
