package grouptrivia.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ViewController {

    @GetMapping(value={
            "/",
            "/game/**",
            "/home",
    })
    public String app() {
        return "index";
    }

}