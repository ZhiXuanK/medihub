import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserDetails } from '../../models';
import { AuthService } from '../../services/firebase-auth.service';
import { AuthStore } from '../../stores/auth.store';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{

  private fb = inject(FormBuilder)
  private authSvc = inject(AuthService)
  private authStore = inject(AuthStore)
  private router = inject(Router)
  private activatedRoute = inject(ActivatedRoute)

  
  user !: FormGroup

  errorMessage: string = ''

  ngOnInit(): void {
    this.user = this.createUser()

    //check if there is error message
    this.activatedRoute.queryParams.subscribe(params => {
      this.errorMessage = params['error'] || ''
    })
  }

  //Minimum eight characters, at least one letter and one number:
  private createUser(): FormGroup{
    return this.fb.group({
      email: this.fb.control<string>('', [Validators.required, Validators.email]),
      password: this.fb.control<string>('', [Validators.required, Validators.pattern("^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$")])
    })
  }

  protected valid(ctrlName:string):boolean {
    const ctrl = this.user.get(ctrlName)
    return !ctrl?.pristine && !!ctrl?.valid
  }

  protected signIn(){
    const user:UserDetails = this.user.value
    console.info(">>>user detail: ", user)
    this.authSvc.signIn(user.email, user.password)
      .then(res => {
        this.authStore.setAuthStatus({response: res, uid: res.user?.uid!})
        console.log('User signed in: ', res.user?.uid)
        this.router.navigate(['/dashboard'])
      })
      .catch(err => {
        console.error('error: ', err)

        const errorCode = err.code
        
        switch(errorCode) {
          //if new user, redirect to signup
          case 'auth/user-not-found':
            this.router.navigate(['/signup'])
            break
          //if wrong password or user did not sign up with email/password, redirect to login
          case 'auth/wrong-password':
            this.router.navigate(['/login'], {queryParams: {error: 'Incorrect Password'}})
            break
          //if other error, redirect to login with error message
          default:
            this.router.navigate(['/login'], {queryParams: {error: 'Error. Please try again later.'}})
            break
        }
      })
  }
  
  protected googleSignIn(){
    this.authSvc.loginWithGoogle()
      .then(res => {
        this.authStore.setAuthStatus({response: res, uid: res.user?.uid!})
        console.log(res)
        //check if user is a new user. if yes, redirect to signup page
        if (res.additionalUserInfo?.isNewUser){
          console.log('new user detected')
          this.router.navigate(['/signup'])
        }
        //if existing user, redirect to dashboard
        console.log('User signed in: ', res.user?.uid)
        this.router.navigate(['/dashboard'])
      })
      .catch(err => {
        //if error, redirect back to login with error message
        console.error('error: ', err)
        this.router.navigate(['/login'], {queryParams: {error: 'Error. Please try again later.'}})
      })
  }



}
