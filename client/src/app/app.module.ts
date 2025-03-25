import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

//external
import { ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';
import { Router, RouterModule, Routes } from '@angular/router';
import { AngularFireModule } from '@angular/fire/compat';
import { GoogleMapsModule } from '@angular/google-maps'
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura'

//internal
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { LoginComponent } from './component/login/login.component';
import { SignupComponent } from './component/signup/signup.component';
import { ProfileComponent } from './component/profile/profile.component';
import { MapComponent } from './component/map/map.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { AuthService } from './services/firebase-auth.service';
import { AuthGuard } from './auth.guards';
import { VisitComponent } from './component/visit/visit.component';
import { AuthStore } from './stores/auth.store';
import { CalendarService } from './services/calendar.service';
import { UserService } from './services/user.service';
import { VisitService } from './services/visit.service';
import { APIService } from './services/api.service';
import { PrimeModule } from './primeng.module';

const appRoutes:Routes = [
  { path:'', component: LoginComponent },
  { path:'signup', component: SignupComponent },
  { path:'dashboard', component: DashboardComponent },
  { path:'profile', component:ProfileComponent },
  { path:'map', component: MapComponent},
  { path:'**', component:DashboardComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    ProfileComponent,
    MapComponent,
    DashboardComponent,
    VisitComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    GoogleMapsModule,
    RouterModule.forRoot(appRoutes),
    PrimeModule
  ],
  providers: [
    provideHttpClient(),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura
      }
    }),
    AuthService,
    AuthGuard,
    AuthStore,
    CalendarService,
    UserService,
    VisitService,
    APIService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
