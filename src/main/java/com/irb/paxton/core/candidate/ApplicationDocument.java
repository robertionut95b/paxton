package com.irb.paxton.core.candidate;

import com.irb.paxton.auditable.AuditableEntity;
import com.irb.paxton.core.model.PaxtonEntity;
import lombok.*;

import javax.persistence.*;

import static com.irb.paxton.config.properties.ApplicationProperties.TABLE_PREFIX;

@Entity
@Table(name = TABLE_PREFIX + "_APPLICATION_DOCUMENT")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ApplicationDocument extends PaxtonEntity<Long> {

    @ManyToOne
    @JoinColumn(name = "document_id")
    private Document document;

    @ManyToOne
    @JoinColumn(name = "application_id")
    private Application application;
}
