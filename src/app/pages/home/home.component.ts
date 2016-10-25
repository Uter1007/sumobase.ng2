import {Component} from "@angular/core";
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {INCREMENT, DECREMENT, RESET} from '../../reducers/counter.reducer';

interface ICounterState {
    counter: number;
}

@Component({
    selector: 'home',  // <home></home>
    templateUrl: './home.component.html'
})
export class HomeComponent{
    counter: Observable<number>;

    constructor(private store: Store<ICounterState>){
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