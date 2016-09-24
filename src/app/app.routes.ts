import {RouterModule, Routes} from '@angular/router';


export const routes: Routes = [
    {
        path: '',
        loadChildren: './submodules/home/home.module'
    },
    {
        path: 'about',
        loadChildren: './submodules/about/about.module'
    }
];

export default RouterModule.forRoot(routes);
