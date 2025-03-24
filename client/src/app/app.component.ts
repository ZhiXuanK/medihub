import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from './services/firebase-auth.service';
import { AuthStore } from './stores/auth.store';
import { APIService } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy{
  title = 'client';

  authSub !: Subscription;

  private authSvc = inject(AuthService)
  private authStore = inject(AuthStore)
  private apiSvc = inject(APIService)

  ngOnInit(): void {
    this.authSub = this.authSvc.getAuthState$().subscribe(
      user => {
        if (user){
          //user is authenticated
          this.authStore.setAuthStatus({response: user, uid: user.uid})
        } else {
          this.authStore.clearAuth();
        }
      }
    )
    this.apiSvc.retrieveApiKeys
    console.log("cal:" , this.apiSvc.calApiKey);
    console.log("map", this.apiSvc.mapsApiKey)
  }

  ngOnDestroy(): void {
    if (this.authSub){
      this.authSub.unsubscribe()
    }
  }

}
