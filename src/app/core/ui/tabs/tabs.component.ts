import { AfterContentInit, Component, ContentChildren, Input, OnInit, QueryList } from '@angular/core';
import { TabComponent } from './tab/tab.component';

export type NavPosition = 'top' | 'bottom';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements OnInit, AfterContentInit {
	@ContentChildren(TabComponent) tabs?: QueryList<TabComponent>;
	@Input() navPosition: NavPosition = 'top';

	ngAfterContentInit(): void {
		if (!this.tabs) {
			return;
		}

		const activeTabs = this.tabs.filter(tab => tab.active) || [];

		if (activeTabs.length === 0) {
			this.selectTab(this.tabs?.first);
		}
	}

	selectTab(tab: TabComponent) {
		if (!this.tabs) {
			return;
		}

		this.tabs.toArray().forEach(tab => (tab.active = false));
		tab.active = true;
	}

	ngOnInit(): void {
	}
}
