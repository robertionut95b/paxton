package com.irb.paxton.core.candidate.documents;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.irb.paxton.core.candidate.Application;
import com.irb.paxton.core.model.PaxtonEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.Hibernate;

import java.util.Objects;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ApplicationDocument extends PaxtonEntity {

    @JsonBackReference(value = "document")
    @ManyToOne
    @JoinColumn(name = "document_id")
    private Document document;

    @JsonBackReference(value = "applicationDocuments")
    @ManyToOne
    @JoinColumn(name = "application_id")
    private Application application;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        ApplicationDocument that = (ApplicationDocument) o;
        return id != null && Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
