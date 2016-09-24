import {NgModule} from '@angular/core/src/metadata/ng_module';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import homeRoutes from "./home.routes";
import {HomeComponent} from './home.component';
@NgModule({
    imports: [
        CommonModule,
        homeRoutes],
    declarations: [HomeComponent]
})
export default class HomeModule{}