import {NgModule} from '@angular/core/src/metadata/ng_module';
import {CommonModule} from '@angular/common';
import aboutRoutes from "./about.routes";
import {AboutComponent} from './about.component';
@NgModule({
    imports: [
        CommonModule,
        aboutRoutes],
    declarations: [AboutComponent]
})
export default class AboutModule{}