import { LightningElement, wire } from "lwc";
import { getUrlParamValue } from "c/iBUtils";
import { CurrentPageReference } from "lightning/navigation";
import { registerListener, unregisterAllListeners } from "c/pubsub";

import getCaseSurveyInfo from "@salesforce/apex/IBComponentAuraController.getCaseSurveyInfo";
import getKnowledgeArticles from "@salesforce/apex/IBComponentAuraController.getKnowledgeArticles";
import getResources from "@salesforce/apex/IBComponentAuraController.getResources";
import isCaseSurveyCompleted from "@salesforce/apex/IBComponentAuraController.isCaseSurveyCompleted";
import saveContactInfo from "@salesforce/apex/IBComponentAuraController.saveContactInfo";
import { refreshApex } from "@salesforce/apex";

export default class iBLightComponent extends LightningElement {
  surveyId;
  surveyName;
  showIBLight;
  articles = [];
  resources = [];
  surveyURL;
  caseNumber;
  caseId;
  isSurveyCompleted = false;
  contactSaved = false;
  showContactInfo = false;

  @wire(CurrentPageReference) pageRef; // Required by pubsub

  connectedCallback() {
    //const param = "id";
    //console.log("====location===" + window.location.href);
    //this.surveyId = getUrlParamValue(window.location.href, param);
    registerListener("ibLightClick", this.handleIBLightClick, this);
  }

  disconnectedCallback() {
    // unsubscribe from bearListUpdate event
    unregisterAllListeners(this);
  }

  handleIBLightClick(survey) {
    console.log("===handleIBLightClick===" + survey.surveyId);
    console.group("==== needContactInfo2====" + survey.needContactInfo);
    this.surveyId = survey.surveyId;
    this.surveyName = survey.surveyName;
    this.showContactInfo = survey.needContactInfo === "true";
    this.contactSaved = false;
    this.isSurveyCompleted = false;

    if (this.surveyId) {
      this.showIBLight = true;

      getCaseSurveyInfo({
        surveyId: this.surveyId,
        surveyName: this.surveyName,
        inputString: ""
      })
        .then(result => {
          this.surveyURL = result.surveyURL;
          this.caseNumber = result.caseNumber;
          this.caseId = result.caseId;

          var self = this;
          this.interval = setInterval(
            function() {
              console.log("===setInterval===");
              if (!this.isSurveyCompleted) {
                isCaseSurveyCompleted({ caseNumber: result.caseNumber }).then(
                  completed => {
                    //this.isSurveyCompleted = completed;
                    console.log(
                      "====isSurveyCompleted====" + this.isSurveyCompleted
                    );
                    console.log(
                      "======= get showContactInfo =====" + this.showContactInfo
                    );
                  }
                );
              } else {
                console.log(
                  "====suvery Completed ====" + this.isSurveyCompleted
                );
                console.log(
                  "==== this.showContactInfo===" + this.showContactInfo
                );
                clearInterval(this.interval);
              }
            }.bind(this),
            3000
          );
        })
        .then(() => {
          window.scrollTo(
            0,
            this.template.querySelector(".ib-light-component").scrollHeight +
              450
          );
        })
        .catch(err => {
          console.log(err);
        });

      getKnowledgeArticles({
        surveyId: this.surveyId,
        surveyName: this.surveyName
      }).then(result => {
        this.articles = result;
        console.log("=== this articles ===" + result);
      });

      getResources({
        surveyId: this.surveyId,
        surveyName: this.surveyName
      }).then(result => {
        this.resources = result;
        console.log("=== this resources ===" + result);
      });
    } else {
      this.showIBLight = false;
    }
  }

  checkCaseSurveyCompleted() {
    console.log("====== checkCaseSurveyCompleted ====");
    if (this.caseNumber) {
      isCaseSurveyCompleted({ caseNumber: this.caseNumber }).then(result => {
        this.isSurveyCompleted = result;
        console.log("====isSurveyCompleted====" + this.isSurveyCompleted);
      });
    }
  }

  handleContactInputChange(event) {
    const fieldName = event.target.fieldName;
    console.log("===fieldName ===" + fieldName);
    if (fieldName == "FirstName") {
      this.lastName = event.target.value;
    } else if (fieldName == "LastName") {
      this.firstName = event.target.value;
    } else if (fieldName == "MobilePhone") {
      this.mobilePhone = event.target.value;
    }
  }

  handleContactSaveClick(event) {
    console.group();
    console.log("======handleContactSaveClick====");
    console.log("=== this.lastName ==" + this.lastName);
    console.log("=== this.firstName ==" + this.firstName);
    console.log("=== this.mobilePhone ==" + this.mobilePhone);
    console.log("===== caseId ===" + this.caseId);
    console.groupEnd();

    var inputJson = {
      firstName: this.firstName,
      lastName: this.lastName,
      mobilePhone: this.mobilePhone,
      caseId: this.caseId
    };
    var inputString = JSON.stringify(inputJson);

    if (this.lastName) {
      saveContactInfo({
        firstName: this.firstName,
        lastName: this.lastName,
        mobilePhone: this.mobilePhone,
        caseId: this.caseId
      }).then(result => {
        console.log("result===" + result);
        this.contactSaved = result;
        this.firstName = "";
        this.lastName = "";
        this.mobilePhone = "";
      });
    }
  }
}