import { Component, ChangeDetectionStrategy } from '@angular/core';
import '../style/app.scss';
import { RouterState } from '@ngrx/router-store';

export interface AppState {
    router: RouterState;
};

@Component({
    selector: 'my-app', // <my-app></my-app>
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {

}