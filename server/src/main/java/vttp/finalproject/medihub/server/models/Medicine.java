package vttp.finalproject.medihub.server.models;

import static vttp.finalproject.medihub.server.Utils.dateToISOString;

import java.io.StringReader;
import java.util.Date;

import jakarta.json.Json;
import jakarta.json.JsonArray;
import jakarta.json.JsonObject;
import jakarta.json.JsonReader;

public class Medicine {

    private String med_id;

    private String visit_id;

    private String name;

    private Date start_date;

    private Date end_date;

    private int dosage;

    private String timing;

    public String getMed_id() {
        return med_id;
    }

    public void setMed_id(String med_id) {
        this.med_id = med_id;
    }

    public String getVisit_id() {
        return visit_id;
    }

    public void setVisit_id(String visit_id) {
        this.visit_id = visit_id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Date getStart_date() {
        return start_date;
    }

    public void setStart_date(Date start_date) {
        this.start_date = start_date;
    }

    public Date getEnd_date() {
        return end_date;
    }

    public void setEnd_date(Date end_date) {
        this.end_date = end_date;
    }

    public int getDosage() {
        return dosage;
    }

    public void setDosage(int dosage) {
        this.dosage = dosage;
    }

    public String getTiming() {
        return timing;
    }

    public void setTiming(String timing) {
        this.timing = timing;
    }

    public Medicine(String med_id, String visit_id, String name, Date start_date, Date end_date, int dosage,
            String timing) {
        this.med_id = med_id;
        this.visit_id = visit_id;
        this.name = name;
        this.start_date = start_date;
        this.end_date = end_date;
        this.dosage = dosage;
        this.timing = timing;
    }

    public Medicine(){

    }

    public static JsonObject toJson(Medicine med){
        JsonReader reader = Json.createReader(new StringReader(med.getTiming()));
        JsonArray arr = reader.readArray();
        return Json.createObjectBuilder()
            .add("med_id", med.getMed_id())
            .add("visit_id", med.getVisit_id())
            .add("name", med.getName())
            .add("start_date", dateToISOString(med.getStart_date()))
            .add("end_date", dateToISOString(med.getEnd_date()))
            .add("dosage", med.getDosage())
            .add("timing", arr)
            .build();
    }
}
