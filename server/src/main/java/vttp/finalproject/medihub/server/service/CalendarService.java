package vttp.finalproject.medihub.server.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class CalendarService {

    public Map<String, Object> createCalendar(String accessToken) {
        WebClient webClient = WebClient.create();

        // Build the calendar creation request payload
        Map<String, Object> calendarRequest = new HashMap<>();
        calendarRequest.put("summary", "Medihub Appointments");
        calendarRequest.put("timeZone", "Asia/Singapore"); // adjust as needed

        // POST to the Calendar Insert endpoint
        Map<String, Object> newCalendar = webClient.post()
                .uri("https://www.googleapis.com/calendar/v3/calendars")
                .header("Authorization", "Bearer " + accessToken)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(calendarRequest)
                .retrieve()
                .bodyToMono(Map.class)
                .block();

        System.out.println(newCalendar.toString());
        return newCalendar;
    }

    public Map<String, Object> createCalendarEvent(String accessToken, String calendarId, Map<String, Object> eventData) {
        WebClient webClient = WebClient.create();
    
        // POST to the events insertion endpoint for your specific calendar
        Map<String, Object> createdEvent = webClient.post()
            .uri("https://www.googleapis.com/calendar/v3/calendars/{calendarId}/events", calendarId)
            .header("Authorization", "Bearer " + accessToken)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(eventData)
            .retrieve()
            .bodyToMono(Map.class)
            .block();
    
        return createdEvent;
    }

}
