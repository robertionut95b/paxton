package com.irb.paxton.security.cors;

import lombok.*;
import org.springframework.http.HttpMethod;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.Collection;
import java.util.stream.Collectors;

import static com.irb.paxton.config.ApplicationProperties.TABLE_PREFIX;

@Entity
@Table(name = TABLE_PREFIX + "_CORS_RECORDS")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CorsRecord {
    @Setter(AccessLevel.NONE)
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", nullable = false)
    private Long id;

    @NotNull
    @NotBlank
    @NotEmpty
    private String url;

    @NotEmpty
    private boolean isAllowed = false;

    @NotEmpty
    private Long maxAge = 3600L;

    @ElementCollection
    @JoinTable(name = TABLE_PREFIX + "_CORS_RECORDS_METHODS", joinColumns = @JoinColumn(name = "corsRecord_id"))
    @Column(name = "method", nullable = false)
    @Enumerated(EnumType.STRING)
    private Collection<HttpMethod> methods;

    protected String getFlattenMethods() {
        return this.methods.stream().map((m) -> m.name().toUpperCase()).collect(Collectors.joining(", "));
    }
}
