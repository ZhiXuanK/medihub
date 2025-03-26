package vttp.finalproject.medihub.server.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import jakarta.json.JsonObject;
import vttp.finalproject.medihub.server.component.EmailServiceImplementation;
import vttp.finalproject.medihub.server.repository.ProfileRepository;
import vttp.finalproject.medihub.server.repository.UserRepository;

@Service
public class EmailService {
    
    @Autowired
    private MedicineService medSvc;

    @Autowired 
    private EmailServiceImplementation emailSvcImpl;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private ProfileRepository profileRepo;

    @Scheduled(cron = "0 0 11 * * *")
    public void sendLowMedicationReminder(){
        Map<String, List<JsonObject>> medicines = medSvc.getLowSupplyMedicineByUser();
        for (String key : medicines.keySet()){
            String email = userRepo.retrieveUserEmail(key);
            String nickName = profileRepo.retrieveProfile(key).get().get(0).getString("name");
            String text = String.format(
                "Dear %s,\n\n" +
                "Your medicine is running low. Please refill your prescription soon.\n\n" +
                "Best regards,\n" +
                "MediHub Team", 
                nickName
            );

            emailSvcImpl.sendEmailReminder(email, "Low Medicine Supply Alert", text);
        }
    }

}
