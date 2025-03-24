package vttp.finalproject.medihub.server.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.json.Json;
import jakarta.json.JsonObject;
import vttp.finalproject.medihub.server.service.ApiService;


@RestController
@RequestMapping("/api/key")
public class ApiController {

    @Autowired
    private ApiService apiSvc;

    @GetMapping("/maps")
    public ResponseEntity<String> getGoogleMapsKey(){

        String maps = apiSvc.getMapsApiKey();

        JsonObject resp = Json.createObjectBuilder()
            .add("apikey", maps)
            .build();

        return ResponseEntity.ok(resp.toString());
    }

    @GetMapping("/cal")
    public ResponseEntity<String> getGoogleCalKey(){
        
        String cal = apiSvc.getCalApiKey();

        JsonObject resp = Json.createObjectBuilder()
            .add("apikey", cal)
            .build();

        return ResponseEntity.ok(resp.toString());
    }
    
}
