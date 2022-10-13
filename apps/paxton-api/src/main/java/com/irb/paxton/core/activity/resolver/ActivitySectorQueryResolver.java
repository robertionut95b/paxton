package com.irb.paxton.core.activity.resolver;

import com.irb.paxton.core.activity.ActivitySector;
import com.irb.paxton.core.activity.ActivitySectorRepository;
import graphql.kickstart.tools.GraphQLQueryResolver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
public class ActivitySectorQueryResolver implements GraphQLQueryResolver {

    @Autowired
    private ActivitySectorRepository activitySectorRepository;

    public List<ActivitySector> getAllActivitySectors() {
        return this.activitySectorRepository.findAll();
    }
}
