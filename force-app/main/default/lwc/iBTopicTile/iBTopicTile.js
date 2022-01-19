import { LightningElement, api, wire, track } from "lwc";
import { NavigationMixin, CurrentPageReference } from "lightning/navigation";
import { fireEvent } from "c/pubsub";

export default class iBTopicTile extends NavigationMixin(LightningElement) {
  @api topic;
  @wire(CurrentPageReference) pageRef;
  articleListPage;
  url;
  @api articlelist = false;
  @api backbutton = false;
  navigateback = true;
  @api disableseemore;
  showarticleflag;
  @track subtopicarray = []; 
  @track subtopicarray2 = [];
  @api knowledgeviewbycount = false;

  connectedCallback() {
    console.log("this is topic tile");
    this.subtopicarray = this.topic.subtopics;
    for(var i=0;i<this.subtopicarray.length;i++){
      if (i==0 || i== 1){
         this.subtopicarray2.push(this.subtopicarray[i]);
        
      }
    }
    
  }

  

  handleSubtopicClick(event) {
    const type = event.target.getAttribute("data-type");
    const surveyId = event.target.getAttribute("data-id");
    const surveyName = event.target.getAttribute("data-name");
    const needContactInfo = event.target.getAttribute("data-info");

    if (type && type === "IBLight") {
      console.log("==selected IBLight==" + surveyId);
      event.preventDefault();
      fireEvent(this.pageRef, "ibLightClick", {
        surveyId: surveyId,
        surveyName: surveyName,
        needContactInfo: needContactInfo
      });
    }
  }

  handleSeeMoreClick(event) {
    event.preventDefault();
    //create custom event - 
    const selectedEvent = new CustomEvent('selected', { detail: this.topic.Id });
    this.dispatchEvent(selectedEvent);
   
  }

  handleBackNavigation(event){
    this.navigateback = false;
    const backEvent = new CustomEvent('back', {detail: this.navigateback});
    this.dispatchEvent(backEvent);
  }
}