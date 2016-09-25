import {NgModule} from '@angular/core/src/metadata/ng_module';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import registerRoutes from "./register.routes";
import {RegisterComponent} from './register.component';
import {MdButtonModule} from '@angular2-material/button/button';
import {MdCardModule} from '@angular2-material/card';
import {counterReducer} from '../../reducers/counter.reducer';
import {StoreModule} from '@ngrx/store';
import {MdInputModule} from '@angular2-material/input/input';

@NgModule({
    imports: [
        CommonModule,
        registerRoutes,
        MdButtonModule.forRoot(),
        MdCardModule.forRoot()
    ],
    declarations: [RegisterComponent]
})
export default class RegisterModule{}