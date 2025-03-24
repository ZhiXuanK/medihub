package vttp.finalproject.medihub.server.service;

import java.io.StringReader;
import java.text.ParseException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.json.Json;
import jakarta.json.JsonArray;
import jakarta.json.JsonObject;
import jakarta.json.JsonReader;
import static vttp.finalproject.medihub.server.Utils.stringToDate;
import vttp.finalproject.medihub.server.models.Medicine;
import vttp.finalproject.medihub.server.models.Visit;
import vttp.finalproject.medihub.server.repository.MedicineRepository;
import vttp.finalproject.medihub.server.repository.VisitRepository;

@Service
public class RecordService {
    
    @Autowired
    private MedicineRepository medRepo;

    @Autowired
    private VisitRepository visitRepo;

    @Transactional
    public void insertNewVisit(String payload) throws DataAccessException, ParseException{
        JsonReader r = Json.createReader(new StringReader(payload));
        JsonObject v = r.readObject();
        System.out.println(v.toString());

        Visit visit = new Visit(
            v.getString("visit_id"),
            v.getString("user_id"),
            v.getString("doctor"),
            stringToDate(v.getString("visit_date")),
            v.getString("purpose"),
            v.getString("notes")
        );

        //insert visit
        visitRepo.insertVisit(visit);

        JsonArray m = v.getJsonArray("medicine");
        //loop through, create medicine and add to medicine repo
        for (int i = 0; i < m.size(); i++){
            JsonObject med = m.getJsonObject(i);

            Medicine medicine = new Medicine(
                med.getString("med_id"),
                v.getString("visit_id"),
                med.getString("name"),
                stringToDate(med.getString("start_date")),
                stringToDate(med.getString("end_date")),
                med.getInt("dosage"),
                med.getJsonArray("timing").toString()
            );

            medRepo.insertMedicine(medicine);
        }
    }
}