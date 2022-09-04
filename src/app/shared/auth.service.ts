import { Injectable } from '@angular/core';
import { auth } from 'firebase/app';
import { Observable, from } from 'rxjs';
import { AngularTokenService } from 'angular-token';

export interface ISignInCredentials {
  email: string;
  password: string;
}

export interface ICreateCredentials {
  email: string;
  password: string;
  displayName: string;
}

export interface IPasswordReset {
  code: string;
  newPassword: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(private tokenService: AngularTokenService) { }

  signIn(credentials: ISignInCredentials): Observable<any> {
    const body = {
  registration_number: credentials.email,
  password: credentials.password
};
const userResp = from(this.tokenService.signIn({login:  credentials.email, password:   credentials.password}))

return userResp
}


signOut() {
  return from(this.tokenService.signOut());
}

  // register(credentials: ICreateCredentials) {
  //   return from(
  //     this.afAuth.auth.createUserWithEmailAndPassword(credentials.email, credentials.password).then(
  //       () => {
  //         this.afAuth.auth.currentUser.updateProfile({ displayName: credentials.displayName });
  //         this.afAuth.auth.updateCurrentUser(this.afAuth.auth.currentUser);
  //       }
  //     )
  //   );
  // }

  // sendPasswordEmail(email) {
  //   return from(this.afAuth.auth.sendPasswordResetEmail(email));
  // }

  // resetPassword(credentials: IPasswordReset) {
  //   return from(this.afAuth.auth.confirmPasswordReset(credentials.code, credentials.newPassword));
  // }

  // get user(): firebase.User {
  //   return this.afAuth.auth.currentUser;
  // }

}
