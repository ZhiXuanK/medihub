package vttp.finalproject.medihub.server.controller;

import java.text.ParseException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import vttp.finalproject.medihub.server.service.RecordService;

@RestController
@RequestMapping("/api/record")
public class RecordController {

    @Autowired
    private RecordService recordSvc;
    
    //add a new visit into mongodb
    @PostMapping("/addvisit")
    public ResponseEntity<String> postAddVisit(
        @RequestBody String payload
    ) throws DataAccessException, ParseException{
        System.out.println(payload);
        recordSvc.insertNewVisit(payload);

        return ResponseEntity.ok("");
    }

}
