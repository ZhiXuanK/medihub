package vttp.finalproject.medihub.server.service;

import java.text.ParseException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.json.JsonObject;
import static vttp.finalproject.medihub.server.Utils.stringToDate;
import vttp.finalproject.medihub.server.models.Visit;
import vttp.finalproject.medihub.server.repository.VisitRepository;

@Service
public class VisitService {
    
    @Autowired
    private VisitRepository visitRepo;

    public List<Visit> getVisitsByUser(String userid){
        return visitRepo.retrieveAllVisitByUser(userid);
    }

    public void updateVisit(JsonObject obj) throws ParseException{
        Visit visit = new Visit(obj.getString("visit_id"), obj.getString("user_id"), obj.getString("doctor"), stringToDate(obj.getString("visit_date")), obj.getString("purpose"), obj.getString("notes"));
        visitRepo.updateVisit(visit);
    }

}
