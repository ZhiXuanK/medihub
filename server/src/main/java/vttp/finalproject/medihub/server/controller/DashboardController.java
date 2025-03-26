package vttp.finalproject.medihub.server.controller;

import java.text.ParseException;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.json.Json;
import jakarta.json.JsonArray;
import jakarta.json.JsonArrayBuilder;
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
        String aiAdvice = aiSvc.getAiAdvice(medicines);

        JsonObject response = Json.createObjectBuilder()
            .add("advice", aiAdvice)
            .build();

        return ResponseEntity.ok(response.toString());
    }

    @GetMapping("/medicineschedule/{uid}")
    public ResponseEntity<String> getMedicineSchedule(
        @PathVariable String uid
    ) throws ParseException{
        JsonObject results = medSvc.getMedicineScheduleWithId(uid);
        System.out.println(results.toString());

        return ResponseEntity.ok(results.toString());
    }

    @DeleteMapping("/medicineschedule/{med_id}")
    public ResponseEntity<String> reduceMedicineDosage(
        @PathVariable String med_id
    ) throws ParseException{
        medSvc.reduceMed(med_id);

        return ResponseEntity.ok("");
    }

    @GetMapping("/lowsupplymed/{uid}")
    public ResponseEntity<String> getLowSupplyMedicine(
        @PathVariable String uid
    ){
        Map<String, List<JsonObject>> results = medSvc.getLowSupplyMedicineByUser();
        
        if (results.containsKey(uid)){
            List<JsonObject> meds = results.get(uid);
            JsonArrayBuilder builder = Json.createArrayBuilder();
            for (JsonObject obj:meds){
                builder.add(obj.getString("name"));
            }
            JsonArray arr = builder.build();

            JsonObject resp = Json.createObjectBuilder()
                .add("results", arr)
                .build();

            return ResponseEntity.ok(resp.toString());
        }

        JsonArray arr = Json.createArrayBuilder()
            .add("You're well stocked, no need to worry about medicine supply!")
            .build();

        JsonObject resp = Json.createObjectBuilder()
            .add("results",arr)
            .build();

        return ResponseEntity.ok(resp.toString());

    }
    
    
}
