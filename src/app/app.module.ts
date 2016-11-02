import { NgModule, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { removeNgStyles, createNewHosts } from '@angularclass/hmr';

import {StoreModule} from '@ngrx/store';
import {counterReducer} from './reducers/counter.reducer';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {StoreLogMonitorModule, useLogMonitor} from '@ngrx/store-log-monitor';

import appRoutes from './app.routes';
import {RouterStoreModule, routerReducer} from '@ngrx/router-store';

@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        FormsModule,

        StoreModule.provideStore({
            counter: counterReducer,
            router: routerReducer
        }),
        RouterStoreModule.connectRouter(),
        StoreDevtoolsModule.instrumentStore({
            monitor: useLogMonitor({
                visible: true,
                position: 'right'
            })
        }),
        RouterStoreModule.connectRouter(),
        StoreLogMonitorModule,

        appRoutes
    ],
    declarations: [AppComponent],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor(public appRef: ApplicationRef) {}
    hmrOnInit(store) {
        console.log('HMR store', store);
    }
    hmrOnDestroy(store) {
        let cmpLocation = this.appRef.components.map(cmp => cmp.location.nativeElement);
        // recreate elements
        store.disposeOldHosts = createNewHosts(cmpLocation);
        // remove styles
        removeNgStyles();
    }
    hmrAfterDestroy(store) {
        // display new elements
        store.disposeOldHosts();
        delete store.disposeOldHosts;
    }
}
