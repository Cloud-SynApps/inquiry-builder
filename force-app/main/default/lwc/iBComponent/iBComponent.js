import { LightningElement } from "lwc";
import initData from "@salesforce/apex/IBComponentAuraController.initData";
import getCaseSurveyInfo from "@salesforce/apex/IBComponentAuraController.getCaseSurveyInfo";

export default class iBComponent extends LightningElement {
  surveys;
  addContact;
  isNetworkUser;
  surveyURL;
  caseNumber;
  lastName;
  firstName;
  mobilePhone;

  connectedCallback() {
    initData().then(result => {
      this.surveys = result;
    });

    this.isNetworkUser = false;
    this.addContact = true;
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

  handleSurveyNameClick(event) {
    console.log("==handleSurveyNameClick==" + event.target.innerText);

    console.log(
      "== selected survey developer name===" +
        event.target.getAttribute("data-developer-name")
    );
    console.log(
      "== selected survey Id===" + event.target.getAttribute("data-id")
    );

    const surveyId = event.target.getAttribute("data-id");
    const surveyName = event.target.innerText;
    var inputJson = {
      firstName: this.firstName,
      lastName: this.lastName,
      mobilePhone: this.mobilePhone
    };
    var inputString = JSON.stringify(inputJson);
    if (surveyId) {
      getCaseSurveyInfo({
        surveyId: surveyId,
        surveyName: surveyName,
        inputString: inputString
      }).then(result => {
        this.surveyURL = result.surveyURL;
        this.caseNumber = result.caseNumber;
      });
    }
  }
}