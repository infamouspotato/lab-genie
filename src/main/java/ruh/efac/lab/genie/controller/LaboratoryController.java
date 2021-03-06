/*
 * (C) Copyright 2010-2015 hSenid Mobile Solutions (Pvt) Limited.
 * All Rights Reserved.
 *
 * These materials are unpublished, proprietary, confidential source code of
 * hSenid Mobile Solutions (Pvt) Limited and constitute a TRADE SECRET
 * of hSenid Mobile Solutions (Pvt) Limited.
 *
 * hSenid Mobile Solutions (Pvt) Limited retains all title to and intellectual
 * property rights in these materials.
 */

package ruh.efac.lab.genie.controller;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;
import ruh.efac.lab.genie.domain.Instrument;
import ruh.efac.lab.genie.domain.Laboratory;
import ruh.efac.lab.genie.repository.InstrumentsRepository;
import ruh.efac.lab.genie.repository.LaboratoryRepository;

import java.util.Collections;
import java.util.List;

/*
 * Created by GayanB
 */
@Controller
public class LaboratoryController {
    private static final Logger logger = LogManager.getLogger(LaboratoryController.class);

    @Autowired
    private LaboratoryRepository laboratoryRepository;

    @RequestMapping("/lab")
    public ModelAndView openEditSourceConfigurationPage() {
        logger.info("Request received to open the laboratory view page");
        return new ModelAndView("search", Collections.emptyMap());
    }

    @RequestMapping(value = "/lab/names", produces = "application/json")
    public @ResponseBody List<Laboratory> getLaboratoryNames() {
        logger.info("Request received to get list of all labs view page");
        return laboratoryRepository.getAllLabs();
    }

    /*@RequestMapping(value = "/lab/instruments", produces = "application/json", method = RequestMethod.GET)
    public @ResponseBody List<Instrument> getInstrumentsForLab(@RequestParam(value = "labName") String labName) {
        logger.info("Request received to get the instruments list for lab name [{}]", labName);
        return instrumentsRepository.getInstruments(labName);
    }*/

    /*@RequestMapping(value = "/lab/instruments/byname", produces = "application/json", method = RequestMethod.GET)
    public @ResponseBody List<Instrument> getInstrumentsForLabByName(@RequestParam(value = "labName") String labName,
                                                                     @RequestParam(value = "instrumentName") String instrumentName) {
        logger.info("Request received to get the instruments list for lab name [{}]", labName);
        return instrumentsRepository.getInstruments(labName, instrumentName);
    }

    public void setInstrumentsRepository(InstrumentsRepository instrumentsRepository) {
        this.instrumentsRepository = instrumentsRepository;
    }*/

    public void setLaboratoryRepository(LaboratoryRepository laboratoryRepository) {
        this.laboratoryRepository = laboratoryRepository;
    }
}
