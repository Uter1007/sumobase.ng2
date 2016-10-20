import {RouterModule, Routes} from '@angular/router';


export const routes: Routes = [
    {
        path: '',
        loadChildren: './pages/home/home.module#HomeModule'
    },
    {
        path: 'about',
        loadChildren: './pages/about/about.module#AboutModule'
    },
    {
        path: 'register',
        loadChildren: './pages/register/register.module#RegisterModule'
    }
];

export default RouterModule.forRoot(routes);
