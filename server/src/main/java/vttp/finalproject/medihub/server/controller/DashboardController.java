package vttp.finalproject.medihub.server.controller;

import java.text.ParseException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.json.Json;
import jakarta.json.JsonObject;
import vttp.finalproject.medihub.server.service.AIService;
import vttp.finalproject.medihub.server.service.MedicineService;


@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {


    @Autowired
    private AIService aiSvc;

    @Autowired
    private MedicineService medSvc;

    //to get drug interaction ai advice for medicine of the day for user
    @GetMapping("/druginteraction")
    public ResponseEntity<String> getDrugInteractionAdvice(
        @RequestParam String uid
    ) throws ParseException{
        List<String> medicines = medSvc.getAllMedicineOfTheDay(uid);
        System.out.println(medicines.get(0));
        String aiAdvice = aiSvc.getAiAdvice(medicines);

        JsonObject response = Json.createObjectBuilder()
            .add("advice", aiAdvice)
            .build();

        return ResponseEntity.ok(response.toString());
    }
    
    
}
