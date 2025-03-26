package vttp.finalproject.medihub.server;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.Locale;

public class Utils {
    
    // SQL statements
    public static final String Q_CHECK_USER_EXIST = """
        SELECT * FROM users WHERE user_id=?
        """;

    public static final String Q_INSERT_USER = """
        INSERT INTO users(email, user_id) VALUES (?, ?)
        """;

    public static final String Q_RETRIEVE_USER_EMAIL = """
            SELECT email FROM users WHERE user_id=?
            """;
        
    public static final String Q_INSERT_VISIT = """
        INSERT INTO visit(visit_id, user_id, doctor, visit_date, purpose, notes) VALUES (?, ?, ?, ?, ?, ?)
        """;

    public static final String Q_UPDATE_VISIT = """
        UPDATE visit SET visit_date=?, purpose=?, notes=? WHERE visit_id=?
        """;

    public static final String Q_RETRIEVE_VISIT = """
        SELECT * FROM visit WHERE visit_id=?
        """;
    
    public static final String Q_RETRIEVE_USERS_WITH_VISIT_TODAY = """
            select * from visit where visit_date=?
            """;
    
    public static final String Q_RETRIEVE_VISITS_BY_USER = """
            select * from visit where user_id=?;
            """;

    public static final String Q_INSERT_MEDICINE = """
        INSERT INTO medicine(med_id, visit_id, name, start_date, end_date, dosage, timing) VALUES (?, ?, ?, ?, ?, ?, ?)
        """;

    public static final String Q_RETRIEVE_MEDICINE = """
        SELECT * FROM medicine WHERE med_id=?
        """;

    //select med.med_id, med.name, med.dosage, v.user_id from medicine as med inner join visit as v on med.visit_id = v.visit_id where dosage <=5;
    public static final String Q_RETRIEVE_LOW_SUPPLY_MEDICINE = """
        select med.med_id, med.name, med.dosage, v.user_id from medicine as med inner join visit as v on med.visit_id = v.visit_id where dosage <=5
        """;

    public static final String Q_RETRIEVE_MEDICINE_MORNING_STRING = """
        select med.*, v.user_id from medicine as med inner join visit as v on med.visit_id = v.visit_id where med.start_date <= ? AND med.end_date>=? and med.timing like '%morning%' and v.user_id=? and dosage >0
        """;

    public static final String Q_RETRIEVE_MEDICINE_AFTERNOON_STRING = """
        select med.*, v.user_id from medicine as med inner join visit as v on med.visit_id = v.visit_id where med.start_date <= ? AND med.end_date>=? and med.timing like '%afternoon%' and v.user_id=? and dosage >0
        """;

    public static final String Q_RETRIEVE_MEDICINE_NIGHT_STRING = """
        select med.*, v.user_id from medicine as med inner join visit as v on med.visit_id = v.visit_id where med.start_date <= ? AND med.end_date>=? and med.timing like '%night%' and v.user_id=? and dosage >0
       """;
    

    public static final String Q_REDUCE_DOSAGE = """
            UPDATE medicine SET dosage=dosage-1 where med_id=?
            """;

    public static final String Q_RETRIEVE_MEDICINE_BY_USER = """
            select med.* from medicine as med inner join visit as v on med.visit_id = v.visit_id where v.user_id=?;
            """;

    public static final String Q_UPDATE_MEDICINE = """
        UPDATE medicine SET start_date=?, end_date=?, dosage=? WHERE med_id=?
        """;

    //methods
    public static Date stringToDate(String date) throws ParseException{
        SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");
        return df.parse(date);
    }

    public static String dateToISOString(Date date){
        ZonedDateTime zdt = date.toInstant().atZone(ZoneId.systemDefault());
        String isoString = zdt.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME);
        return isoString;
    }

    public static long dateToLong(String date) throws ParseException{
        SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");
        return df.parse(date).getTime();
    }

    public static Date longToDate(Long epoch){
        return new Date(epoch);
    }

}
