package vttp.finalproject.medihub.server.repository;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Repository;

import jakarta.json.Json;
import jakarta.json.JsonObject;
import static vttp.finalproject.medihub.server.Utils.Q_INSERT_MEDICINE;
import static vttp.finalproject.medihub.server.Utils.Q_RETRIEVE_LOW_SUPPLY_MEDICINE;
import static vttp.finalproject.medihub.server.Utils.Q_RETRIEVE_MEDICINE;
import static vttp.finalproject.medihub.server.Utils.Q_RETRIEVE_MEDICINE_TIME_STRING;
import static vttp.finalproject.medihub.server.Utils.longToDate;
import vttp.finalproject.medihub.server.models.Medicine;

@Repository
public class MedicineRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    //insert new medicine
    public void insertMedicine(Medicine medicine) throws DataAccessException, ParseException {
        jdbcTemplate.update(Q_INSERT_MEDICINE, medicine.getMed_id(), medicine.getVisit_id(), medicine.getName(), medicine.getStart_date().getTime(), medicine.getEnd_date().getTime(), medicine.getDosage(), medicine.getTiming());
    }

    //retrieve medicine based on medicine id
    public Medicine retrieveMedicine(String medid){
        final SqlRowSet rs = jdbcTemplate.queryForRowSet(Q_RETRIEVE_MEDICINE, medid);
        rs.next();
        Medicine medicine = new Medicine(
            rs.getString("med_id"),
            rs.getString("visit_id"),
            rs.getString("name"),
            longToDate(rs.getLong("start_date")),
            longToDate(rs.getLong("end_date")),
            rs.getInt("dosage"),
            rs.getString("timing")
        );

        return medicine;
    }

    //get list of medicine where dosage is less than 5
    public List<JsonObject> getLowSupplyMedicine(){
        final SqlRowSet rs = jdbcTemplate.queryForRowSet(Q_RETRIEVE_LOW_SUPPLY_MEDICINE);
        List<JsonObject> medicineList = new LinkedList<>();
        while (rs.next()){
            JsonObject medicine = Json.createObjectBuilder()
                .add("med_id", rs.getString("med_id"))
                .add("name", rs.getString("name"))
                .add("dosage", rs.getInt("dosage"))
                .add("user_id", rs.getString("user_id"))
                .build();
            medicineList.add(medicine);
        }
        return medicineList;
    }

    //get list of medicine that needs to be taken today
    public Map<String, List<String>> getMedicineOfTheDay(String uid) throws ParseException{
        String currentDate = new Date().toString();
        SimpleDateFormat sdfInput = new SimpleDateFormat("EEE MMM dd HH:mm:ss zzz yyyy");
        Date midDate = sdfInput.parse(currentDate);
        SimpleDateFormat sdfOutput = new SimpleDateFormat("yyyy-MM-dd");
        String date = sdfOutput.format(midDate);
        List<String> all = new LinkedList<>();

        List<String> morning = new LinkedList<>();
        SqlRowSet rsMorning = jdbcTemplate.queryForRowSet(Q_RETRIEVE_MEDICINE_TIME_STRING, date, "%morning%", uid);
        while (rsMorning.next()){
            morning.add(rsMorning.getString("name"));
            all.add(rsMorning.getString("name"));
        }

        List<String> afternoon = new LinkedList<>();
        SqlRowSet rsAfternoon = jdbcTemplate.queryForRowSet(Q_RETRIEVE_MEDICINE_TIME_STRING, date, "%afternoon%", uid);
        while (rsAfternoon.next()){
            afternoon.add(rsAfternoon.getString("name"));
            all.add(rsAfternoon.getString("name"));
        }

        List<String> night = new LinkedList<>();
        SqlRowSet rsNight = jdbcTemplate.queryForRowSet(Q_RETRIEVE_MEDICINE_TIME_STRING, date, "%night%", uid);
        while (rsNight.next()){
            night.add(rsNight.getString("name"));
            all.add(rsNight.getString("name"));
        }

        Map<String, List<String>> results = new HashMap<>();
        results.put("morning", morning);
        results.put("afternoon", afternoon);
        results.put("night", night);
        results.put("all", all);

        return results;
    }
}
