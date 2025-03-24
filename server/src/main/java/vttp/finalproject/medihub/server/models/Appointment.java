package vttp.finalproject.medihub.server.models;

public class Appointment {
    
    private String summary;

    private String description;

    private String start;

    private String end;

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStart() {
        return start + ":00";
    }

    public void setStart(String start) {
        this.start = start;
    }

    public String getEnd() {
        return end + ":00";
    }

    public void setEnd(String end) {
        this.end = end;
    }

    public Appointment(String summary, String description, String start, String end) {
        this.summary = summary;
        this.description = description;
        this.start = start;
        this.end = end;
    }

    public Appointment(){

    }

}

