import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { ApiKey } from "../models";


@Injectable()
export class APIService {

    mapsApiKey !: string
    calApiKey !: String

    private http = inject(HttpClient)

    async retrieveApiKeys():Promise<void>{

        await firstValueFrom(this.http.get<ApiKey>('/api/key/maps')).then(resp => this.mapsApiKey = resp.apikey)
        await firstValueFrom(this.http.get<ApiKey>('/api/key/cal')).then(resp => this.calApiKey = resp.apikey)

        console.log("maps: ", this.mapsApiKey)
        console.log("cal: ", this.calApiKey);
    }

}