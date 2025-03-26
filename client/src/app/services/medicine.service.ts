import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { LowSupplyResponse, Medicine, MedicineSchedule } from "../models";
import { firstValueFrom } from "rxjs";


@Injectable()
export class MedicineService {

    private http = inject(HttpClient)

    retrieveMedicineOfTheDay(uid:string):Promise<MedicineSchedule>{
        return firstValueFrom(this.http.get<MedicineSchedule>(`api/dashboard/medicineschedule/${uid}`)).then(res => {console.log(res); return res})
    }

    reduceDosage(med_id:string):void{
        firstValueFrom(this.http.delete(`/api/dashboard/medicineschedule/${med_id}`))
    }

    retrieveLowSupplyMedicine(uid:string):Promise<LowSupplyResponse>{
        return firstValueFrom(this.http.get<LowSupplyResponse>(`api/dashboard/lowsupplymed/${uid}`)).then(res => {console.log(res); return res})
    }

    updateMedicine(medicine:Medicine){
        return firstValueFrom(this.http.put<Medicine>('/api/record/updatemedicine', medicine)).then(res=>console.log("med"))
    }


}