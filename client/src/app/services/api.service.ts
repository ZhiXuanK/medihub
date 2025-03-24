import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";


@Injectable()
export class APIService {

    mapsApiKey !: string
    calApiKey !: String

    private http = inject(HttpClient)

    async retrieveApiKeys():Promise<void>{

        await firstValueFrom(this.http.get<string>('/api/key/maps')).then(resp => this.mapsApiKey = resp)
        await firstValueFrom(this.http.get<string>('/api/key/cal')).then(resp => this.calApiKey = resp)

    }

}