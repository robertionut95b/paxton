package com.irb.paxton.core.candidate;

import com.irb.paxton.core.base.BaseEntity;
import lombok.*;

import javax.persistence.*;

import static com.irb.paxton.config.properties.ApplicationProperties.TABLE_PREFIX;

@Entity
@Table(name = TABLE_PREFIX + "_APPLICATION_DOCUMENT")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ApplicationDocument extends BaseEntity {
    @Setter(AccessLevel.NONE)
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", nullable = false)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "document_id")
    private Document document;

    @ManyToOne
    @JoinColumn(name = "application_id")
    private Application application;
}
