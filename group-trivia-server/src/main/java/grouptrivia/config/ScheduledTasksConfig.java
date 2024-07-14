package grouptrivia.config;

import grouptrivia.services.GroupTriviaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;


@Configuration
@EnableScheduling
public class ScheduledTasksConfig {

    private final GroupTriviaService groupTriviaService;

    @Autowired
    public ScheduledTasksConfig(GroupTriviaService groupTriviaService) {
        this.groupTriviaService = groupTriviaService;
    }

    @Scheduled(cron = "*/5 * * * * *") // Cron expression for every 5 seconds
    public void findUsersInactiveForSecondsAndRemove() {
        groupTriviaService.findUsersInactiveForSecondsAndRemove();
    }

}