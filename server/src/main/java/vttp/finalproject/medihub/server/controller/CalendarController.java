package vttp.finalproject.medihub.server.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.client.WebClient;

import jakarta.json.Json;
import jakarta.json.JsonArray;
import jakarta.json.JsonArrayBuilder;
import jakarta.json.JsonObject;
import vttp.finalproject.medihub.server.models.Appointment;
import vttp.finalproject.medihub.server.service.CalendarService;


@RestController
@RequestMapping("/api/calendar")
public class CalendarController {

    @Autowired
    private CalendarService calSvc;

    private final WebClient webClient = WebClient.create();

    @GetMapping(path={"/events"})
    public ResponseEntity<?> getMedicalEvents(
        @RequestHeader("Authorization") String authorization
    ){
        if (authorization == null || !authorization.startsWith("Bearer ")){
            return ResponseEntity.status(401).body("Missing or invalid authorization header");
        }

        String accessToken = authorization.substring("Bearer ".length());

        Map<String, Object> response = webClient.get()
            .uri(uriBuilder -> uriBuilder
                .scheme("https")
                .host("www.googleapis.com")
                .path("/calendar/v3/calendars/primary/events")
                .queryParam("q", "Medical Appointment")
                // .queryParam("timeMin", Instant.now().toString())
                //.queryParam("singleEvents", "true")
                //.queryParam("orderBy", "start")
                .build())
            .header("Authorization", "Bearer " + accessToken)
            .retrieve()
            .bodyToMono(Map.class)
            .block();

        List<Map<String, Object>> events = (List<Map<String, Object>>) response.get("items");
        JsonArrayBuilder arrBuild = Json.createArrayBuilder();
        for (Map<String, Object> event : events){
            JsonObject obj = Json.createObjectBuilder()
                .add("summary", (String) event.get("summary"))
                .add("description", (String) event.get("description"))
                .add("start", (String) ((Map<String, Object>) event.get("start")).get("dateTime"))
                .add("end", (String) ((Map<String, Object>) event.get("end")).get("dateTime"))
                .build();

            arrBuild.add(obj);
        }
        JsonArray arr = arrBuild.build();
        return ResponseEntity.ok(arr.toString());
    }

    @PostMapping(path={"/events"})
    public ResponseEntity<String> postMedicalEvent(
        @RequestHeader("Authorization") String authorization,
        @RequestBody Appointment appointment
    ){
        if (authorization == null || !authorization.startsWith("Bearer ")){
            return ResponseEntity.status(401).body("Missing or invalid authorization header");
        }

        String accessToken = authorization.substring("Bearer ".length());

        Map<String, Object> apptPayload = new HashMap<>();
        apptPayload.put("summary", appointment.getSummary());
        apptPayload.put("description", appointment.getDescription());

        Map<String, Object> start = new HashMap<>();
        start.put("dateTime", appointment.getStart());
        start.put("timeZone", "Asia/Singapore");

        Map<String, Object> end = new HashMap<>();
        end.put("dateTime", appointment.getEnd());
        end.put("timeZone", "Asia/Singapore");

        apptPayload.put("start", start);
        apptPayload.put("end", end);

        Map<String, Object> createdEvent = webClient.post()
            .uri("https://www.googleapis.com/calendar/v3/calendars/primary/events")
            .header("Authorization", "Bearer " + accessToken)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(apptPayload)
            .retrieve()
            .bodyToMono(Map.class)
            .block();

        JsonObject obj = Json.createObjectBuilder()
            .add("summary", (String) createdEvent.get("summary"))
            .add("description", (String) createdEvent.get("description"))
            .build();

        return ResponseEntity.ok(obj.toString());
    }

    public WebClient getWebClient() {
        return webClient;
    }

}
