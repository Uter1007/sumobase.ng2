import { Component, ChangeDetectionStrategy } from '@angular/core';
import '../style/app.scss';
import { Store } from '@ngrx/store';
import { INCREMENT, DECREMENT, RESET } from './reducers/counter.reducer';
import { Observable } from 'rxjs/observable';

interface IAppState {
    counter: number;
}

@Component({
    selector: 'my-app', // <my-app></my-app>
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
    counter: Observable<number>;

    constructor(private store: Store<IAppState>){
        this.counter = <any>this.store.select('counter');
    }

    increment(){
        this.store.dispatch({ type: INCREMENT });
    }

    decrement(){
        this.store.dispatch({ type: DECREMENT });
    }

    reset(){
        this.store.dispatch({ type: RESET });
    }
}