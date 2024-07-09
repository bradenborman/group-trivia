package grouptrivia;

import org.springframework.boot.builder.SpringApplicationBuilder;

public class Server extends GroupTriviaApplication {

    public static void main(String[] args) {
        new Server().configure(new SpringApplicationBuilder())
                .initializers()
                .profiles("local", "secret")
                .run(args);
    }

}