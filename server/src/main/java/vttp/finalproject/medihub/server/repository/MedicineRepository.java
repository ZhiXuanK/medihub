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
import static vttp.finalproject.medihub.server.Utils.Q_REDUCE_DOSAGE;
import static vttp.finalproject.medihub.server.Utils.Q_RETRIEVE_LOW_SUPPLY_MEDICINE;
import static vttp.finalproject.medihub.server.Utils.Q_RETRIEVE_MEDICINE;
import static vttp.finalproject.medihub.server.Utils.Q_RETRIEVE_MEDICINE_AFTERNOON_STRING;
import static vttp.finalproject.medihub.server.Utils.Q_RETRIEVE_MEDICINE_BY_USER;
import static vttp.finalproject.medihub.server.Utils.Q_RETRIEVE_MEDICINE_MORNING_STRING;
import static vttp.finalproject.medihub.server.Utils.Q_RETRIEVE_MEDICINE_NIGHT_STRING;
import static vttp.finalproject.medihub.server.Utils.Q_UPDATE_MEDICINE;
import static vttp.finalproject.medihub.server.Utils.dateToLong;
import static vttp.finalproject.medihub.server.Utils.longToDate;
import vttp.finalproject.medihub.server.models.Medicine;
import vttp.finalproject.medihub.server.models.Visit;

@Repository
public class MedicineRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // insert new medicine
    public void insertMedicine(Medicine medicine) throws DataAccessException, ParseException {
        jdbcTemplate.update(Q_INSERT_MEDICINE, medicine.getMed_id(), medicine.getVisit_id(), medicine.getName(),
                medicine.getStart_date().getTime(), medicine.getEnd_date().getTime(), medicine.getDosage(),
                medicine.getTiming());
    }

    public void updateMedicine(Medicine medicine){
        jdbcTemplate.update(Q_UPDATE_MEDICINE, medicine.getStart_date().getTime(), medicine.getEnd_date().getTime(), medicine.getDosage(), medicine.getMed_id());
    }

    // retrieve medicine based on medicine id
    public Medicine retrieveMedicine(String medid) {
        final SqlRowSet rs = jdbcTemplate.queryForRowSet(Q_RETRIEVE_MEDICINE, medid);
        rs.next();
        Medicine medicine = new Medicine(
                rs.getString("med_id"),
                rs.getString("visit_id"),
                rs.getString("name"),
                longToDate(rs.getLong("start_date")),
                longToDate(rs.getLong("end_date")),
                rs.getInt("dosage"),
                rs.getString("timing"));

        return medicine;
    }

    public void reduceMed(String med_id){
        jdbcTemplate.update(Q_REDUCE_DOSAGE, med_id);
    }

    // get list of medicine where dosage is less than 5
    public List<JsonObject> getLowSupplyMedicine() {
        final SqlRowSet rs = jdbcTemplate.queryForRowSet(Q_RETRIEVE_LOW_SUPPLY_MEDICINE);
        List<JsonObject> medicineList = new LinkedList<>();
        while (rs.next()) {
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

    public List<Medicine> retrieveMedicineByUser(String userid){
        final SqlRowSet rs = jdbcTemplate.queryForRowSet(Q_RETRIEVE_MEDICINE_BY_USER, userid);
        List<Medicine> medicines = new LinkedList<>();
        while (rs.next()){
            Medicine medicine = new Medicine(
                rs.getString("med_id"),
                rs.getString("visit_id"),
                rs.getString("name"),
                longToDate(rs.getLong("start_date")),
                longToDate(rs.getLong("end_date")),
                rs.getInt("dosage"),
                rs.getString("timing"));

            medicines.add(medicine);
        }
        return medicines;
    }

    // get list of medicine that needs to be taken today - only name
    public Map<String, List<String>> getMedicineOfTheDay(String uid) throws ParseException {
        String currentDate = new Date().toString();
        SimpleDateFormat sdfInput = new SimpleDateFormat("EEE MMM dd HH:mm:ss zzz yyyy");
        Date midDate = sdfInput.parse(currentDate);
        SimpleDateFormat sdfOutput = new SimpleDateFormat("yyyy-MM-dd");
        Long date = dateToLong(sdfOutput.format(midDate));
        List<String> all = new LinkedList<>();

        List<String> morning = new LinkedList<>();
        final SqlRowSet rsMorning = jdbcTemplate.queryForRowSet(Q_RETRIEVE_MEDICINE_MORNING_STRING, date, date, uid);
        while (rsMorning.next()) {
            morning.add(rsMorning.getString("name"));
            all.add(rsMorning.getString("name"));
        }

        List<String> afternoon = new LinkedList<>();
        final SqlRowSet rsAfternoon = jdbcTemplate.queryForRowSet(Q_RETRIEVE_MEDICINE_AFTERNOON_STRING, date, date, uid);
        while (rsAfternoon.next()) {
            afternoon.add(rsAfternoon.getString("name"));
            all.add(rsAfternoon.getString("name"));
        }

        List<String> night = new LinkedList<>();
        final SqlRowSet rsNight = jdbcTemplate.queryForRowSet(Q_RETRIEVE_MEDICINE_NIGHT_STRING, date, date, uid);
        while (rsNight.next()) {
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

    // get list of medicine that needs to be taken today - only name
    public Map<String, List<JsonObject>> getMedicineOfTheDayWithId(String uid) throws ParseException {

        String currentDate = new Date().toString();
        SimpleDateFormat sdfInput = new SimpleDateFormat("EEE MMM dd HH:mm:ss zzz yyyy");
        Date midDate = sdfInput.parse(currentDate);
        SimpleDateFormat sdfOutput = new SimpleDateFormat("yyyy-MM-dd");
        Long date = dateToLong(sdfOutput.format(midDate));
        // List<String> all = new LinkedList<>();

        List<JsonObject> morning = new LinkedList<>();
        final SqlRowSet rsMorning = jdbcTemplate.queryForRowSet(Q_RETRIEVE_MEDICINE_MORNING_STRING, date, date, uid);
        while (rsMorning.next()) {
            JsonObject obj;
            obj = Json.createObjectBuilder()
                    .add("name", rsMorning.getString("name"))
                    .add("med_id", rsMorning.getString("med_id"))
                    .add("taken", false)
                    .build();
            morning.add(obj);
            // all.add(rsMorning.getString("name"));
        }

        List<JsonObject> afternoon = new LinkedList<>();
        final SqlRowSet rsAfternoon = jdbcTemplate.queryForRowSet(Q_RETRIEVE_MEDICINE_AFTERNOON_STRING, date, date, uid);
        while (rsAfternoon.next()) {
            JsonObject obj = Json.createObjectBuilder()
                    .add("name", rsAfternoon.getString("name"))
                    .add("med_id", rsAfternoon.getString("med_id"))
                    .add("taken", false)
                    .build();
            afternoon.add(obj);
            // all.add(rsAfternoon.getString("name"));
        }

        List<JsonObject> night = new LinkedList<>();
        final SqlRowSet rsNight = jdbcTemplate.queryForRowSet(Q_RETRIEVE_MEDICINE_NIGHT_STRING, date, date, uid);
        while (rsNight.next()) {
            JsonObject obj = Json.createObjectBuilder()
                    .add("name", rsNight.getString("name"))
                    .add("med_id", rsNight.getString("med_id"))
                    .add("taken", false)
                    .build();
            night.add(obj);
            // all.add(rsNight.getString("name"));
        }

        Map<String, List<JsonObject>> results = new HashMap<>();
        results.put("morning", morning);
        results.put("afternoon", afternoon);
        results.put("night", night);
        // results.put("all", all);

        return results;
    }
}
