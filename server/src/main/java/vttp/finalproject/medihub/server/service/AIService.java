package vttp.finalproject.medihub.server.service;

import java.util.List;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;


@Service
public class AIService {
    
    @Value("classpath:/ai-prompt-template.st")
    private Resource promptTemplateResource;

    private final ChatClient chatClient;
    
    public AIService(ChatClient.Builder aiClientBuilder){
        this.chatClient = aiClientBuilder.build();
    }

    public String getAiAdvice(List<String> medicines){
        String medicine = "";
        if (medicines.size() == 0){
            return "No Medicine Advice for the day";
        }
        for (String s:medicines){
            if (medicine == ""){
                medicine = s;
            } else {
                medicine = medicine + "," + s;
            }
        }
        final String med = medicine;
        System.out.println(med);
        // if (med.length() == 0){
        //     return "No medicine for the day";
        // }

        String query = chatClient.prompt()
            .user(
                userSpec -> userSpec.text(promptTemplateResource)
                .param("medicines", med)
            ).call().content();

        return query;
    }


}
