import { AfterViewInit, Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from './services/firebase-auth.service';
import { AuthStore } from './stores/auth.store';
import { APIService } from './services/api.service';
import { Router } from '@angular/router';
import {MenuItem} from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy{
  title = 'client';
  
  @ViewChild('navbar') navbar !: ElementRef
  @ViewChild('spacer') spacer !: ElementRef

  authSub !: Subscription;
  items!:MenuItem[]

  private authSvc = inject(AuthService)
  private authStore = inject(AuthStore)
  private apiSvc = inject(APIService)
  private router = inject(Router)

  menuOpen = false;

  async ngOnInit(): Promise<void> {

    await this.apiSvc.retrieveApiKeys()

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
  }

  ngAfterViewInit(): void {
    const navbarHeight = this.navbar.nativeElement.offsetHeight
    this.spacer.nativeElement.style.height = `${navbarHeight}px`
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  logout(): void {
    this.authSvc.logout();
    this.authStore.clearAuth();
    this.router.navigate(["/"])
  }

  ngOnDestroy(): void {
    if (this.authSub){
      this.authSub.unsubscribe()
    }
  }

}
