package com.irb.paxton.core.connection.listener;

import com.irb.paxton.core.connection.Connection;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.event.spi.*;
import org.hibernate.persister.entity.EntityPersister;

@Slf4j
public class ConnectionEventListener implements PostDeleteEventListener, PostUpdateEventListener, PostInsertEventListener {
    @Override
    public void onPostDelete(PostDeleteEvent postDeleteEvent) {
        Object entity = postDeleteEvent.getEntity();
        if (entity instanceof Connection connection) {
            //TODO handle logic...
        }

    }

    @Override
    public void onPostInsert(PostInsertEvent postInsertEvent) {
        Object entity = postInsertEvent.getEntity();
        if (entity instanceof Connection connection) {
            //TODO handle logic...
        }

    }

    @Override
    public void onPostUpdate(PostUpdateEvent postUpdateEvent) {
        Object entity = postUpdateEvent.getEntity();
        if (entity instanceof Connection connection) {
            //TODO handle logic...
        }

    }

    @Override
    public boolean requiresPostCommitHandling(EntityPersister entityPersister) {
        return false;
    }
}