package vttp.finalproject.medihub.server.service;

import org.springframework.stereotype.Service;

import com.google.api.client.util.Value;

@Service
public class ApiService {
    
    @Value("${GOOGLEMAPS_API}")
    private String mapsApi;

    @Value("${GOOGLECAL_API}")
    private String calApi;

    public String getMapsApiKey(){
        return mapsApi;
    }

    public String getCalApiKey(){
        return calApi;
    }

}
