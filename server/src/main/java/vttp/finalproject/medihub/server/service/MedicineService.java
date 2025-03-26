package vttp.finalproject.medihub.server.service;

import static vttp.finalproject.medihub.server.Utils.stringToDate;

import java.text.ParseException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.json.Json;
import jakarta.json.JsonArray;
import jakarta.json.JsonArrayBuilder;
import jakarta.json.JsonObject;
import vttp.finalproject.medihub.server.models.Medicine;
import vttp.finalproject.medihub.server.repository.MedicineRepository;
import vttp.finalproject.medihub.server.repository.ProfileRepository;
import vttp.finalproject.medihub.server.repository.VisitRepository;

@Service
public class MedicineService {
    
    @Autowired
    private MedicineRepository medRepo;

    public void updateMedicine(JsonObject obj) throws ParseException{

        Medicine medicine = new Medicine(
            obj.getString("med_id"),
            obj.getString("visit_id"),
            obj.getString("name"),
            stringToDate(obj.getString("start_date")),
            stringToDate(obj.getString("end_date")),
            obj.getInt("dosage"),
            obj.getJsonArray("timing").toString()
        );

        medRepo.updateMedicine(medicine);

    }

    public List<Medicine> getMedicinesByUser(String userid){
        return medRepo.retrieveMedicineByUser(userid);
    }

    //get list of medicine that are running low - {userId: [medicine], userId: [medicine]}
    public Map<String, List<JsonObject>> getLowSupplyMedicineByUser(){
        List<JsonObject> medicineList = medRepo.getLowSupplyMedicine();
        
        Map<String, List<JsonObject>> groupedByUser = medicineList.stream()
            .collect(Collectors.groupingBy(obj -> obj.getString("user_id")));
        
        return groupedByUser;
    }

    public List<String> getAllMedicineOfTheDay(String uid) throws ParseException{
        List<String> allMeds = medRepo.getMedicineOfTheDay(uid).get("all");
        System.out.println(">>>Size: " + allMeds.size());
        return allMeds;
    }


    //get medicine schedule - {morning: [medicine], afternoon: [medicine], night: [medicine]}
    public Map<String, List<String>> getMedicineSchedule(String uid) throws ParseException{
        Map<String, List<String>> medicine = medRepo.getMedicineOfTheDay(uid);
        return medicine;
    }

    public JsonObject getMedicineScheduleWithId(String uid) throws ParseException{

        Map<String, List<JsonObject>> results = medRepo.getMedicineOfTheDayWithId(uid);

        JsonArrayBuilder mornBuild = Json.createArrayBuilder();
        for (JsonObject obj: results.get("morning")){
            mornBuild.add(obj);
        }
        JsonArray mornArr = mornBuild.build();

        JsonArrayBuilder aftBuild = Json.createArrayBuilder();
        for (JsonObject obj:results.get("afternoon")){
            aftBuild.add(obj);
        }
        JsonArray aftArr = aftBuild.build();

        JsonArrayBuilder nightBuild = Json.createArrayBuilder();
        for (JsonObject obj:results.get("night")){
            nightBuild.add(obj);
        }
        JsonArray nightArr = nightBuild.build();

        JsonObject schedule = Json.createObjectBuilder()
            .add("morning", mornArr)
            .add("afternoon", aftArr)
            .add("night", nightArr)
            .build();

        return schedule;

    }

    public void reduceMed(String med_id){
        this.medRepo.reduceMed(med_id);
    }
}
