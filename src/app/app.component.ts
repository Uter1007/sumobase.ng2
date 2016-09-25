import { Component, ChangeDetectionStrategy } from '@angular/core';
import '../style/app.scss';
import { Store } from '@ngrx/store';
import { INCREMENT, DECREMENT, RESET } from './reducers/counter.reducer';
import { Observable } from 'rxjs/observable';

@Component({
    selector: 'my-app', // <my-app></my-app>
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {

}