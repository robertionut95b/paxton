package com.irb.paxton.core.candidate.documents;

import com.irb.paxton.core.candidate.Application;
import com.irb.paxton.core.candidate.ApplicationService;
import com.irb.paxton.core.candidate.documents.input.ApplicationDocumentInput;
import com.irb.paxton.storage.validator.FileValidatorService;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.io.InputStream;

import static com.irb.paxton.config.properties.ApplicationProperties.API_VERSION;

@Slf4j
@RestController
@RequestMapping(path = "api/" + API_VERSION + "/applications")
public class ApplicationDocumentController {

    @Autowired
    ApplicationDocumentService applicationDocumentService;

    @Autowired
    FileValidatorService fileValidatorService;

    @Autowired
    ApplicationService applicationService;

    @PostMapping(value = "/{applicationId}/documents/upload", produces = MediaType.TEXT_PLAIN_VALUE)
    public String uploadApplicationDocument(@PathVariable Long applicationId, ApplicationDocumentInput applicationDocumentInput) {
        if (!fileValidatorService.checkFileMimeType(applicationDocumentInput.getFiles(), "pdf")) {
            throw new IllegalArgumentException("Files must be of type %s".formatted("pdf/doc(x)"));
        }
        Application application = applicationService.findById(applicationId);
        Document document = applicationDocumentService.addDocumentsToApplication(application, applicationDocumentInput);
        return document.getId().toString();
    }

    @DeleteMapping(value = "/{applicationId}/documents/delete")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteApplicationDocument(@PathVariable Long applicationId, @RequestBody String documentInput) {
        Application application = applicationService.findById(applicationId);
        applicationDocumentService.deleteDocumentByApplicationAndDocumentId(application, documentInput);
    }

    @GetMapping(value = "/{applicationId}/documents/{fileName}", produces = {MediaType.APPLICATION_PDF_VALUE})
    public ResponseEntity<byte[]> getApplicationDocument(@PathVariable Long applicationId, @PathVariable String fileName) throws IOException {
        Application application = applicationService.findById(applicationId);
        Resource resource = applicationDocumentService.loadApplicationDocumentByApplicationAndName(application, fileName);
        try (InputStream in = resource.getInputStream()) {
            return ResponseEntity
                    .ok()
                    .contentLength(resource.contentLength())
                    .header("Content-Disposition", "attachment; filename=%s".formatted(resource.getFilename()))
                    .body(IOUtils.toByteArray(in));
        }
    }
}
