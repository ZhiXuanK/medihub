import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { MedicineSchedule } from "../models";
import { firstValueFrom } from "rxjs";


@Injectable()
export class MedicineService {

    private http = inject(HttpClient)

    retrieveMedicineOfTheDay(uid:string):Promise<MedicineSchedule>{
        return firstValueFrom(this.http.get<MedicineSchedule>(`api/dashboard/medicineschedule/${uid}`))
    }

    reduceDosage(med_id:string):void{
        firstValueFrom(this.http.delete(`/api/dashboard/medicineschedule/${med_id}`))
    }


}