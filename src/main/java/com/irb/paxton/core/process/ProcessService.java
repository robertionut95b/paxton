package com.irb.paxton.core.process;

import com.irb.paxton.core.process.exception.ProcessNotExistsException;
import com.irb.paxton.core.process.input.ProcessInput;
import com.irb.paxton.core.process.input.ProcessInputLkp;
import com.irb.paxton.core.process.input.ProcessInputUpdate;
import com.irb.paxton.core.process.mapper.ProcessMapper;
import com.irb.paxton.core.search.PaginatedResponse;
import com.irb.paxton.core.search.SearchRequest;
import com.irb.paxton.core.search.SearchSpecification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class ProcessService {

    @Autowired
    private ProcessRepository processRepository;

    @Autowired
    private ProcessMapper processMapper;

    public PaginatedResponse<Process> getAllProcesses(SearchRequest searchRequest) {
        if (searchRequest == null) searchRequest = new SearchRequest();
        SearchSpecification<Process> processSearchSpecification = new SearchSpecification<>(searchRequest);
        Pageable pageable = SearchSpecification.getPageable(searchRequest.getPage(), searchRequest.getSize());
        Page<Process> results = this.processRepository.findAll(processSearchSpecification, pageable);
        return new PaginatedResponse<>(
                results,
                searchRequest.getPage(),
                results.getTotalPages(),
                results.getTotalElements()
        );
    }

    public Process createProcess(ProcessInput processInput) {
        return processMapper.inputToProcess(processInput);
    }

    public Process updateProcess(ProcessInputUpdate processInputUpdate) {
        Process process = processRepository
                .findById(processInputUpdate.getId())
                .orElseThrow(() -> new ProcessNotExistsException(String.format("Process by id %s does not exist", processInputUpdate.getId())));
        return processMapper.inputToProcessUpdate(process, processInputUpdate);
    }

    public Process createProcess(ProcessInputLkp processInputLkp) {
        return null;
    }
}
