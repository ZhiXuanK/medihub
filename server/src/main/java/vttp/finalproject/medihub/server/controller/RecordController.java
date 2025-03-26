package vttp.finalproject.medihub.server.controller;

import java.io.StringReader;
import java.text.ParseException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.json.Json;
import jakarta.json.JsonArray;
import jakarta.json.JsonObject;
import jakarta.json.JsonReader;
import vttp.finalproject.medihub.server.service.RecordService;
import vttp.finalproject.medihub.server.service.VisitService;

@RestController
@RequestMapping("/api/record")
public class RecordController {

    @Autowired
    private RecordService recordSvc;

    @Autowired
    private VisitService visitSvc;
    
    //add a new visit into mongodb
    @PostMapping("/addvisit")
    public ResponseEntity<String> postAddVisit(
        @RequestBody String payload
    ) throws DataAccessException, ParseException{
        recordSvc.insertNewVisit(payload);

        return ResponseEntity.ok("");
    }

    @PutMapping("/updatevisit")
    public ResponseEntity<String> updateVisit(
        @RequestBody String payload
    ) throws ParseException{
        JsonReader reader = Json.createReader(new StringReader(payload));
        JsonObject obj = reader.readObject();
        visitSvc.updateVisit(obj);
        return ResponseEntity.ok("");
    }

    @GetMapping("/getallrecords")
    public ResponseEntity<String> getAllRecords(
        @RequestParam String userid
    ){

        JsonArray results = recordSvc.getAllRecordsByUser(userid);

        return ResponseEntity.ok(results.toString());

    }

}
