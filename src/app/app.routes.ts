import {RouterModule, Routes} from '@angular/router';


export const routes: Routes = [
    {
        path: '',
        loadChildren: './submodules/home/home.module#HomeModule'
    },
    {
        path: 'about',
        loadChildren: './submodules/about/about.module#AboutModule'
    }
];

export default RouterModule.forRoot(routes);
