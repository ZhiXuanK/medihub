package vttp.finalproject.medihub.server.component;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

@Component
public class EmailServiceImplementation {
    
    @Autowired
    private JavaMailSender mailSender;

    public void sendEmailReminder(
        String to, String subject, String text
    ){
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("noreply@medihub.com");
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        mailSender.send(message);
    }

}
