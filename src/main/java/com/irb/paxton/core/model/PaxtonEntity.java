package com.irb.paxton.core.model;

import com.irb.paxton.auditable.AuditableEntity;
import io.hypersistence.tsid.TSID;
import io.hypersistence.utils.hibernate.id.Tsid;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serial;

@MappedSuperclass
@NoArgsConstructor
@Getter
@Setter
public abstract class PaxtonEntity extends AuditableEntity implements Identifiable<Long>, UrlIdentifiable {

    @Serial
    private static final long serialVersionUID = 524547079635449585L;

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", nullable = false, updatable = false, unique = true)
    protected Long id;


    @Tsid
    @NotNull
    @Column(nullable = false, unique = true, length = 13)
    protected String urlId = TSID.Factory.getTsid().toString();

    @Override
    public String getUrlId() {
        return this.urlId;
    }

    @Override
    public void setUrlId(String urlId) {
        this.urlId = urlId;
    }
}
