import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { AIAdvice, MedicineSchedule } from "../models";


@Injectable()
export class AIService {

    private http = inject(HttpClient)

    retrieveAIAdvice(uid: string): Promise<AIAdvice> {
        const params = new HttpParams().append("uid", uid)
        return firstValueFrom(this.http.get<AIAdvice>('api/dashboard/druginteraction', {params})).then(res => { console.log(res); return res })
    }
}