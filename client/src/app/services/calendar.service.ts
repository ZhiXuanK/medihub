import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http"
import { Injectable, inject } from "@angular/core"
import { firstValueFrom, from, Observable, switchMap } from "rxjs"
import { MedicalAppointment, Visit } from "../models"
import { AuthStore } from "../stores/auth.store"

declare const google: any

@Injectable()
export class CalendarService {
  private tokenClient: any;
  private accessToken: string = '';
  private isAuthenticated:boolean = false;

  private authStore = inject(AuthStore)

  constructor(private http: HttpClient) {
    this.initializeTokenClient();
  }

  private initializeTokenClient(): void {
    // Initialize the token client with your client ID and required scope.
    this.tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: '124215026994-fagtlh6oeha8e5g2768tu08p6d13aifm.apps.googleusercontent.com',
      scope: 'https://www.googleapis.com/auth/calendar',
      // Define a callback that gets called when a token is returned.
      callback: (tokenResponse: any) => {
        if (tokenResponse.error) {
          console.error("Error obtaining token: ", tokenResponse.error);
          this.isAuthenticated = false
        } else {
          this.accessToken = tokenResponse.access_token;
          this.isAuthenticated = true
          //this.authStore.setAuthStatus(tokenResponse.access_token)
          console.log('Access token obtained:', this.accessToken);
        }
      }
    });
  }

  /**
   * Requests an access token.
   * Returns an Observable that resolves with the access token.
   */
  requestAccessToken(): Observable<string> {
    return from(new Promise<string>((resolve, reject) => {
      // Set the callback for the token client.
      this.tokenClient.callback = (tokenResponse: any) => {
        if (tokenResponse.error) {
            this.isAuthenticated = false
          reject(tokenResponse.error);
        } else {
          this.accessToken = tokenResponse.access_token;
          this.isAuthenticated = true
          //this.authStore.setAuthStatus(this.accessToken)
          resolve(this.accessToken);
        }
      };
      // Trigger the OAuth2 consent flow. This will open a popup for user consent if required.
      this.tokenClient.requestAccessToken();
    }));
  }

  getAuthStatus():boolean {
    return this.isAuthenticated
  }

  getToken():string {
    return this.accessToken
  }

  addMedicalAppointment(medAppt: MedicalAppointment): Observable<any> {
    //const token = this.accessToken
    const token = this.accessToken
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.post('/api/calendar/events', medAppt, { headers })
  }

  retrieveMedicalAppointments(): Observable<MedicalAppointment[]> {
    const token = this.accessToken
    //const token = this.authStore.response$
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.get<MedicalAppointment[]>('/api/calendar/events', { headers })
  }
}