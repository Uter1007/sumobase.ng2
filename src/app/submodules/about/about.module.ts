import {NgModule} from '@angular/core/src/metadata/ng_module';
import {CommonModule} from '@angular/common';
import aboutRoutes from "./about.routes";
import {AboutComponent} from './about.component';
import {MdButtonModule} from '@angular2-material/button';
import {MdCardModule} from '@angular2-material/card';
@NgModule({
    imports: [
        CommonModule,
        aboutRoutes,
        MdButtonModule.forRoot(),
        MdCardModule.forRoot(),
    ],
    declarations: [AboutComponent]
})
export default class AboutModule{}