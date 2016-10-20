import {RouterModule} from "@angular/router";
import {RegisterComponent} from "./register.component";

const routes = [
    {path: '', component: RegisterComponent}
];

export default RouterModule.forChild(routes);
