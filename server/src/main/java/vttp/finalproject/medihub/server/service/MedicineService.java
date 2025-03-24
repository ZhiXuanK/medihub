package vttp.finalproject.medihub.server.service;

import java.text.ParseException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.json.JsonObject;
import vttp.finalproject.medihub.server.repository.MedicineRepository;
import vttp.finalproject.medihub.server.repository.ProfileRepository;
import vttp.finalproject.medihub.server.repository.VisitRepository;

@Service
public class MedicineService {
    
    @Autowired
    private MedicineRepository medRepo;

    @Autowired
    private VisitRepository visitRepo;

    @Autowired
    private ProfileRepository profileRepo;

    //get list of medicine that are running low - {userId: [medicine], userId: [medicine]}
    public Map<String, List<JsonObject>> getLowSupplyMedicineByUser(){
        List<JsonObject> medicineList = medRepo.getLowSupplyMedicine();
        
        Map<String, List<JsonObject>> groupedByUser = medicineList.stream()
            .collect(Collectors.groupingBy(obj -> obj.getString("user_id")));
        
        return groupedByUser;
    }

    public List<String> getAllMedicineOfTheDay(String uid) throws ParseException{
        List<String> allMeds = medRepo.getMedicineOfTheDay(uid).get("all");
        return allMeds;
    }


    //get medicine schedule - {morning: [medicine], afternoon: [medicine], night: [medicine]}
    public Map<String, List<String>> getMedicineSchedule(String uid) throws ParseException{
        Map<String, List<String>> medicine = medRepo.getMedicineOfTheDay(uid);
        return medicine;
    }
}
