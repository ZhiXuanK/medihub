package vttp.finalproject.medihub.server.models;

import java.util.Date;

public class Visit {

    private String visit_id;

    private String user_id;

    private String doctor;

    private Date visit_date;

    private String purpose;

    private String notes;

    public String getVisit_id() {
        return visit_id;
    }

    public void setVisit_id(String visit_id) {
        this.visit_id = visit_id;
    }

    public String getUser_id() {
        return user_id;
    }

    public void setUser_id(String user_id) {
        this.user_id = user_id;
    }

    public String getDoctor() {
        return doctor;
    }

    public void setDoctor(String doctor) {
        this.doctor = doctor;
    }

    public Date getVisit_date() {
        return visit_date;
    }

    public void setVisit_date(Date visit_date) {
        this.visit_date = visit_date;
    }

    public String getPurpose() {
        return purpose;
    }

    public void setPurpose(String purpose) {
        this.purpose = purpose;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public Visit(String visit_id, String user_id, String doctor, Date visit_date, String purpose, String notes) {
        this.visit_id = visit_id;
        this.user_id = user_id;
        this.doctor = doctor;
        this.visit_date = visit_date;
        this.purpose = purpose;
        this.notes = notes;
    }

    public Visit(){

    }
    
}
