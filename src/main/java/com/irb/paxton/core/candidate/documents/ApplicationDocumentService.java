package com.irb.paxton.core.candidate.documents;

import com.irb.paxton.core.candidate.Application;
import com.irb.paxton.core.candidate.ApplicationRepository;
import com.irb.paxton.core.candidate.ApplicationStatus;
import com.irb.paxton.core.candidate.documents.input.ApplicationDocumentInput;
import com.irb.paxton.core.model.AbstractRepository;
import com.irb.paxton.core.model.AbstractService;
import com.irb.paxton.storage.FileResponse;
import com.irb.paxton.storage.StorageService;
import com.irb.paxton.storage.exception.FileNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.core.io.Resource;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

@Service
public class ApplicationDocumentService extends AbstractService<ApplicationDocument> {

    private final ApplicationRepository applicationRepository;

    private final StorageService storageService;

    private final DocumentRepository documentRepository;

    protected ApplicationDocumentService(AbstractRepository<ApplicationDocument> repository, ApplicationRepository applicationRepository, StorageService storageService, DocumentRepository documentRepository) {
        super(repository);
        this.applicationRepository = applicationRepository;
        this.storageService = storageService;
        this.documentRepository = documentRepository;
    }

    @Transactional
    @PreAuthorize("hasRole('ROLE_ADMINISTRATOR') or @paxtonSecurityService.isOwner(authentication, #application.candidate.user.username)")
    public Document addDocumentsToApplication(Application application, ApplicationDocumentInput applicationDocumentInput) {
        if (application.getStatus().equals(ApplicationStatus.FINISHED)) {
            throw new IllegalStateException("Cannot upload documents to a concluded application");
        }

        MultipartFile documentInput = applicationDocumentInput.getFiles();
        // store file on the server
        String userApplicationsLoc = application.getApplicantProfile().getUser().getId().toString();
        FileResponse fileResponse = storageService.store(documentInput, userApplicationsLoc, "applications", application.getId().toString());
        Document document = new Document(fileResponse.getName(), fileResponse.getPath());
        // store the document record
        documentRepository.persist(document);
        // update the application's documents collection
        application.addApplicationDocument(new ApplicationDocument(document, application));
        applicationRepository.persist(application);

        return document;
    }

    @PreAuthorize("hasRole('ROLE_ADMINISTRATOR') or (hasRole('ROLE_RECRUITER') and @paxtonSecurityService.isJobApplicationRecruiter(authentication, #application)) or @paxtonSecurityService.isOwner(authentication, #application.candidate.user.username)")
    public Resource loadApplicationDocumentByApplicationAndName(Application application, String fileName) {
        Optional<ApplicationDocument> applicationDocument = application.getApplicationDocuments()
                .stream()
                .filter(ap -> ap.getDocument().getName().equals(fileName))
                .findFirst();

        if (applicationDocument.isEmpty()) {
            throw new FileNotFoundException("No such application document by name %s exists in the application %s".formatted(fileName, application.getId()));
        }
        ApplicationDocument document = applicationDocument.get();
        return storageService.loadAsResourceFromPath(document.getDocument().getUrl());
    }

    @Transactional
    @PreAuthorize("hasRole('ROLE_ADMINISTRATOR') or (hasRole('ROLE_RECRUITER') and @paxtonSecurityService.isJobApplicationRecruiter(authentication, #application)) or @paxtonSecurityService.isOwner(authentication, #application.candidate.user.username)")
    public void deleteDocumentByApplicationAndDocumentId(Application application, String documentInput) {
        if (application.getStatus().equals(ApplicationStatus.FINISHED)) {
            throw new IllegalStateException("Cannot delete documents of a concluded application");
        }

        Optional<ApplicationDocument> doc = application.getApplicationDocuments()
                .stream()
                .filter(apd -> apd.getDocument().getId().toString().equals(documentInput))
                .findFirst();

        if (doc.isPresent()) {
            ApplicationDocument applicationDocument = doc.get();
            Document document = doc.get().getDocument();
            storageService.remove(document.getUrl());

            application.removeApplicationDocument(applicationDocument);
            applicationRepository.persist(application);
            documentRepository.delete(document);
        } else {
            throw new FileNotFoundException("Document by id %s does not exist".formatted(documentInput));
        }
    }
}
