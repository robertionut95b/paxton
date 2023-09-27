package com.irb.paxton.core.location.resolver;

import com.irb.paxton.core.location.Country;
import com.irb.paxton.core.location.CountryRepository;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsQuery;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@DgsComponent
public class CountryQueryResolver {

    @Autowired
    private CountryRepository countryRepository;

    @DgsQuery
    public List<Country> getCountriesCities() {
        return this.countryRepository.findAll();
    }
}
