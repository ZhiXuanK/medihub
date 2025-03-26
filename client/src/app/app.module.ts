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
// import { environment } from './environments/environment';
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
import { MedicineService } from './services/medicine.service';
import { RefreshComponent } from './component/refresh/refresh.component';
import { AIService } from './services/ai.service';
//import { environment } from './environments/environment';

const appRoutes:Routes = [
  { path:'', component: LoginComponent },
  { path:'signup', component: SignupComponent },
  { path:'dashboard', component: DashboardComponent, canActivate:[AuthGuard] },
  { path:'records', component: VisitComponent, canActivate:[AuthGuard] },
  { path:'profile', component:ProfileComponent, canActivate:[AuthGuard]},
  { path:'map', component: MapComponent, canActivate:[AuthGuard]},
  { path:'refresh', component:RefreshComponent},
  { path:'**', component:DashboardComponent, canActivate:[AuthGuard]}
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    ProfileComponent,
    MapComponent,
    DashboardComponent,
    VisitComponent,
    RefreshComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(    
    {
      apiKey: "AIzaSyAkdymCMzzoj7OISj1x_xEFUUyLnxY2bjI",
      authDomain: "vttpfinalproject-44926.firebaseapp.com",
      projectId: "vttpfinalproject-44926",
      storageBucket: "vttpfinalproject-44926.firebasestorage.app",
      messagingSenderId: "400050802479",
      appId: "1:400050802479:web:b5395e3bfb6fe49c1adbda"
    }),
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
    APIService,
    MedicineService,
    AIService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
