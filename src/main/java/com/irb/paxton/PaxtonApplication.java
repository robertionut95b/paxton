package com.irb.paxton;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.orm.jpa.support.OpenEntityManagerInViewFilter;

import javax.servlet.Filter;

@SpringBootApplication
public class PaxtonApplication {

    public static void main(String[] args) {
        SpringApplication.run(PaxtonApplication.class, args);
    }

    @Bean
    public Filter OpenFilter() {
        return new OpenEntityManagerInViewFilter();
    }
}
