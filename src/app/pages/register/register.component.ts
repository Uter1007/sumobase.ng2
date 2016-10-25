import {Component} from '@angular/core';

@Component({
    selector: 'register',
    templateUrl: 'register.component.html',
})

export class RegisterComponent {

    private user = {};

    registerAction = () => {
        console.log('register with data', this.user);
    }

}
