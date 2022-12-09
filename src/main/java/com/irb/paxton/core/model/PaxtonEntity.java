package com.irb.paxton.core.model;

import com.irb.paxton.auditable.AuditableEntity;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@MappedSuperclass
@NoArgsConstructor
public abstract class PaxtonEntity<T> extends AuditableEntity implements Identifiable<T> {

    /**
     * Abstract and generic identifiable (which must include a generic identifier) entity used for all model entities in the application
     */

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    protected T id;

    @Override
    public T getId() {
        return id;
    }

    @Override
    public void setId(T id) {
        this.id = id;
    }
}
