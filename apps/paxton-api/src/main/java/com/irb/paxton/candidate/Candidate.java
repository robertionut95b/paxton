package com.irb.paxton.candidate;

import com.irb.paxton.baseEntity.BaseEntity;
import lombok.*;

import javax.persistence.*;

import static com.irb.paxton.config.ApplicationProperties.TABLE_PREFIX;

@Entity
@Table(name = TABLE_PREFIX + "_CANDIDATE")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Candidate extends BaseEntity {
    @Setter(AccessLevel.NONE)
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", nullable = false)
    private Long id;

}
