package com.irb.paxton;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class SpaController {

    @RequestMapping(value = "/{path:[^\\.]*}")
    public String redirectSingle() {

        return "forward:/index.html";
    }

    @GetMapping("/*/{path:[^\\.]*}")
    public String redirectNested() {

        return "forward:/index.html";
    }
}
