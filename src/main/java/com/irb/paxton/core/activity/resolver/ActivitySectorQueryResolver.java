package com.irb.paxton.core.activity.resolver;

import com.irb.paxton.core.activity.ActivitySector;
import com.irb.paxton.core.activity.ActivitySectorRepository;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsQuery;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@DgsComponent
public class ActivitySectorQueryResolver {

    @Autowired
    private ActivitySectorRepository activitySectorRepository;

    @DgsQuery
    public List<ActivitySector> getAllActivitySectors() {
        return this.activitySectorRepository.findAll();
    }
}
