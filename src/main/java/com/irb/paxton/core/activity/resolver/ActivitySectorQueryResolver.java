package com.irb.paxton.core.activity.resolver;

import com.irb.paxton.core.activity.ActivitySector;
import com.irb.paxton.core.activity.ActivitySectorRepository;
import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsQuery;

import java.util.List;

@DgsComponent
public class ActivitySectorQueryResolver {

    private final ActivitySectorRepository activitySectorRepository;

    public ActivitySectorQueryResolver(ActivitySectorRepository activitySectorRepository) {
        this.activitySectorRepository = activitySectorRepository;
    }

    @DgsQuery
    public List<ActivitySector> getAllActivitySectors() {
        return this.activitySectorRepository.findAll();
    }
}
