import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { Visit } from "../models";


@Injectable()
export class VisitService {

    private http = inject(HttpClient)

    retrieveRecord(visitid: string){

    }

    retrieveAllVisitsByUser(userid:string):Promise<Visit[]>{
        console.log("userid"+userid)
        const params = new HttpParams().append("userid", userid)
        return firstValueFrom(this.http.get<Visit[]>('/api/record/getallrecords', {params})).then(res => {console.log(res); return res})
    }

    addNewVisit(visit:Visit){
        firstValueFrom(this.http.post<Visit>('/api/record/addvisit', visit)).then(res =>{console.log(res)})
    }
}