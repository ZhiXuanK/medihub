import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { Visit } from "../models";


@Injectable()
export class VisitService {

    private http = inject(HttpClient)

    retrieveRecord(visitid: string){

    }

    addNewVisit(visit:Visit){
        firstValueFrom(this.http.post<Visit>('/api/record/addvisit', visit)).then(res =>{console.log(res)})
    }
}