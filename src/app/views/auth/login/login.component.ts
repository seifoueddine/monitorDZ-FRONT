import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  @ViewChild('loginForm') loginForm: NgForm;
  emailModel = 'admin@gmail.com';
  passwordModel = '123456';

  buttonDisabled = false;
  buttonState = '';

  constructor(private authService: AuthService, private notifications: NotificationsService, private router: Router) { }

  ngOnInit() {
  }

  onSubmit() {
    if (!this.loginForm.valid || this.buttonDisabled) {
      return;
    }
    this.buttonDisabled = true;
    this.buttonState = 'show-spinner';


      
    this.authService.signIn(this.loginForm.value).subscribe((user) => {

      if(user.status === 200){
  

        localStorage.setItem('isLoggedin', 'true');
        localStorage.setItem('user', JSON.stringify(user.body.data));
        localStorage.setItem('avatar', JSON.stringify(user.body.data.avatar.url));
        const role = user.body.data.role
        switch (role) {
          case 'GodLike':
            this.router.navigate(['/admin/dashboard']); 
            break;
            case 'SuperOP':
              this.router.navigate(['/admin/articles-for-sort']); 
              break;
               case 'ClientAdmin':
              this.router.navigate(['/admin/client-articles']); 
              break;
          default:
            break;
        }


        // if(user.body.data.role === 'admin'){
        //  this.router.navigate(['/app/slugs']);
        // }else{
        //   this.router.navigate(['/app/checks']);
        // }


      }
    }, (error) => {
      this.buttonDisabled = false;
      this.buttonState = '';
        this.notifications.create('Erreur', "Informations de connexion invalides, veuillez réessayer", NotificationType.Error, { theClass: 'primary', timeOut: 6000, showProgressBar: false});
    });




    // this.authService.signIn(this.loginForm.value).subscribe((user) => {
    //   this.router.navigate(['/']);
    // }, (error) => {
    //   this.buttonDisabled = false;
    //   this.buttonState = '';
    //   this.notifications.create('Error', error.message, NotificationType.Bare, { theClass: 'outline primary', timeOut: 6000, showProgressBar: false });
    // });
  }
}
