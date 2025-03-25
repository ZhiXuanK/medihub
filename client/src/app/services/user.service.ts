import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { MedicalProfileDetails } from "../models";
import { firstValueFrom } from "rxjs";
import { AngularFireAuth } from "@angular/fire/compat/auth";


@Injectable()
export class UserService {

    private http = inject(HttpClient)
    private afAuth = inject(AngularFireAuth)

    signup(){
        this.afAuth.currentUser.then(
            user => {
                user?.getIdToken().then(
                    token => {
                        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)
                        firstValueFrom(this.http.post('/api/user/signup', {}, {headers})).then(res => {console.log(res)})
                    }
                )
            }
        )
    }

    saveProfile(medProfile: MedicalProfileDetails): void {
        firstValueFrom(this.http.post<MedicalProfileDetails>('/api/user/saveprofile', medProfile))
    }

    retrieveProfile():Promise<MedicalProfileDetails>{
        return this.afAuth.currentUser.then(
            user => {
                const params = new HttpParams().append("uid", user!.uid)
                console.log(">>>parans: ", params)
                return firstValueFrom(this.http.get<MedicalProfileDetails>('/api/user/retrieveprofile', {params}))
            }
        )
    }

    updateProfile(medProfile:MedicalProfileDetails):void {
        firstValueFrom(this.http.put<MedicalProfileDetails>('/api/user/updateprofile', medProfile)).then(res =>{console.log(res)})
    }

}