import {NgModule} from '@angular/core/src/metadata/ng_module';
import {CommonModule} from '@angular/common';
import registerRoutes from "./register.routes";
import {RegisterComponent} from './register.component';
import {MdButtonModule} from '@angular2-material/button/button';
import {MdCardModule} from '@angular2-material/card';
import {FormsModule} from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        registerRoutes,
        MdButtonModule.forRoot(),
        MdCardModule.forRoot(),
        FormsModule
    ],
    declarations: [RegisterComponent]
})
export class RegisterModule{}
