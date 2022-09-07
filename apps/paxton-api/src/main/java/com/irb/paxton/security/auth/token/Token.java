package com.irb.paxton.security.auth.token;

import com.irb.paxton.baseEntity.BaseEntity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;

import static com.irb.paxton.config.Constants.TABLE_PREFIX;

@Entity
@Table(name = TABLE_PREFIX + "_TOKEN")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Token extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", nullable = false)
    private Long id;

    @NotNull
    private LocalDate expiresAt;

    @NotNull
    @Enumerated(value = EnumType.STRING)
    private TokenType tokenType;

    @Transient
    private Boolean isExpired;
}
