import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutModule } from './layout/layout.module';
import { TabsViewerModule } from './tabs-viewer/tabs-viewer.module';
import { ProjectModule } from './project/project.module';
import { NetworkModule } from './network/network.module';
import { ActionHistoryModule } from './action-history/action-history.module';
import { CoreModule } from './core/core.module';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { EffectsModule } from '@ngrx/effects';
import { ProjectTabsModule } from './tabs-viewer/modules/project-tabs/project-tabs.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
	declarations: [
		AppComponent,
	],
    imports: [
        ActionHistoryModule,
        TabsViewerModule,
        NetworkModule,
        LayoutModule,
        BrowserModule,
        AppRoutingModule,
        ProjectModule,
        CoreModule,
        StoreModule.forRoot({}),
        EffectsModule.forRoot(),
        StoreDevtoolsModule.instrument({
            maxAge: 25,
            logOnly: environment.production,
            autoPause: true,
        }),
        ProjectTabsModule,
        BrowserAnimationsModule,
    ],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
