package com.irb.paxton.core.organization;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.irb.paxton.core.activity.ActivitySector;
import com.irb.paxton.core.jobs.JobListing;
import com.irb.paxton.core.location.City;
import com.irb.paxton.core.model.PaxtonEntity;
import com.irb.paxton.core.process.Process;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serial;
import java.time.LocalDate;
import java.util.Collection;
import java.util.Optional;

import static com.irb.paxton.utils.StringUtils.slugifyString;

@Entity
@Table(
        indexes = {
                @Index(name = "px_org_slug_idx", columnList = "slug_name", unique = true)
        }, uniqueConstraints = {
        @UniqueConstraint(name = "px_uc_organization_name_slug_name", columnNames = {"name", "slug_name"})
})
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Organization extends PaxtonEntity {

    @Serial
    private static final long serialVersionUID = 2770718697434193607L;

    @NotNull
    @NotBlank
    @NotEmpty
    private String name;

    @NotNull
    @NotBlank
    @NotEmpty
    @Column(nullable = false, unique = true, name = "slug_name")
    private String slugName;

    @Column(length = 100)
    @Size(message = "Slogan must have between 5 and 100 characters", min = 5, max = 100)
    @NotEmpty
    @NotBlank
    private String slogan;

    @NotNull
    @NotBlank
    @NotEmpty
    @Column(length = 2000)
    private String description;

    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE}, optional = false)
    @JoinColumn(name = "headquarters_id", nullable = false)
    private City headQuarters;

    @OneToMany(mappedBy = "organization", cascade = CascadeType.ALL)
    private Collection<JobListing> jobs;

    private String photography;

    @JsonManagedReference
    @OneToMany(mappedBy = "organization", cascade = CascadeType.ALL, orphanRemoval = true)
    private Collection<Recruiter> recruiters;

    @ManyToOne
    @JoinColumn(name = "process_id")
    private Process recruitmentProcess;

    private java.net.URL webSite;

    @NotNull
    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE}, optional = false)
    @JoinColumn(name = "activity_sector_id", nullable = false)
    private ActivitySector activitySector;

    @Column(nullable = false)
    @NotNull
    @PastOrPresent(message = "Date must be at least in the present or past time")
    private LocalDate foundedAt;

    @NotNull
    @Enumerated
    @Column(nullable = false)
    private OrganizationSize companySize;

    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(name = "organization_locations",
            joinColumns = @JoinColumn(name = "organization_id"),
            inverseJoinColumns = @JoinColumn(name = "cities_id"))
    @JsonBackReference
    private Collection<City> locations;

    @ElementCollection(targetClass = Specialization.class)
    @JoinTable(name = "ORGANIZATION_SPECIALIZATIONS", joinColumns = @JoinColumn(name = "organization_id"))
    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Collection<Specialization> specializations;

    @OneToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinColumn(name = "affiliate_organization_id")
    private Collection<Organization> affiliates;

    @PrePersist
    private void prePersist() {
        this.slugName = slugifyString(this.name);
    }

    public void addRecruiter(Recruiter recruiter) {
        if (!this.recruiters.contains(recruiter)) {
            this.recruiters.add(recruiter);
        }
    }

    public void removeRecruiter(Recruiter recruiter) {
        this.recruiters.remove(recruiter);
    }

    public void setRecruitersList(Collection<Recruiter> recruitersList) {
        if (recruitersList != null) {
            this.getRecruiters().clear();
            recruitersList.forEach(this::addRecruiter);
        }
    }

    public Optional<Recruiter> getRecruiterById(Long recruiterId) {
        return this.recruiters.stream().filter(r -> r.getId().equals(recruiterId)).findFirst();
    }
}
