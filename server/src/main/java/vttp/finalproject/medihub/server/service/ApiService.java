package vttp.finalproject.medihub.server.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;


@Service
public class ApiService {
    
    @Value("${googlemaps.api}")
    private String mapsApi;

    @Value("${googlecal.api}")
    private String calApi;

    public String getMapsApiKey(){
        return mapsApi;
    }

    public String getCalApiKey(){
        return calApi;
    }

}
