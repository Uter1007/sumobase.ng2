import {NgModule} from '@angular/core/src/metadata/ng_module';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import homeRoutes from "./home.routes";
import {HomeComponent} from './home.component';
import {MdButtonModule} from '@angular2-material/button/button';
import {MdCardModule} from '@angular2-material/card';
import {counterReducer} from '../../reducers/counter.reducer';
import {StoreModule} from '@ngrx/store';

@NgModule({
    imports: [
        CommonModule,
        homeRoutes,
        MdButtonModule.forRoot(),
        MdCardModule.forRoot()
    ],
    declarations: [HomeComponent]
})
export default class HomeModule{}