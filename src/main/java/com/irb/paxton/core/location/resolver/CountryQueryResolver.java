package com.irb.paxton.core.location.resolver;

import com.irb.paxton.core.location.Country;
import com.irb.paxton.core.location.CountryRepository;
import graphql.kickstart.tools.GraphQLQueryResolver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
public class CountryQueryResolver implements GraphQLQueryResolver {

    @Autowired
    private CountryRepository countryRepository;

    public List<Country> getCountriesCities() {
        return this.countryRepository.findAll();
    }
}
