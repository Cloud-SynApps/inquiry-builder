import { LightningElement,api,wire,track } from 'lwc';
import getQuestion from '@salesforce/apex/InquiryBuilderController.getQuestion';
import getNextAction from '@salesforce/apex/InquiryBuilderController.getNextAction';

export default class IBElement extends LightningElement {
    constructor()
    {
        super();
    }
    question;
    error;
    loaded = true;
    questionId = 'a3b6g000001AtsqAAC';
    selectedOption;
    selectedOptions;
    currentSelection;
    result = false;

    handleChange(event) {
        const selectedOption = event.detail.value;
        console.log(`Option selected with value: ${selectedOption}`);
        this.currentSelection = selectedOption;
    }
    @api element;

   handleNext(event) {
        this.loaded = false;
        console.log('handleNext event',this.selectedOption);
        if(this.currentSelection == "a3d6g000000VhbLAAS")
        {
            this.question = null;
            this.result = true;
            this.loaded = true;
        }
        else
        {
            this.selectedOption = this.currentSelection;
        }
        
        // get next questionId
        //console.log('this.question answers-->',this.question.answers);
        //var answerLst = this.question.answers;
        /*answerLst.forEach(function (item, index) {
            console.log('answer item nothing important');
            
          });*/
        //this.questionId = 'a3b6g000001AtsvAAC';
    }

    handlePrevious(event) {
        this.loaded = false;
        console.log('handleBack');
        // get next questionId
        //console.log('this.question answers-->',this.question.answers);
        //var answerLst = this.question.answers;
        /*answerLst.forEach(function (item, index) {
            console.log('answer item nothing important');
            
          });*/
        this.questionId = 'a3b6g000001AtsqAAC';
    }

    @wire(getNextAction, { selectedOption: '$selectedOption' })
    nextaction({ error, data }) {
        if (data) {
           console.log('data-->',data);
           this.question = data;
        } else if (error) {
            console.log('error-->',error);
        }
        this.loaded = true;
    }

    @wire(getQuestion, { questionId: '$questionId' })
    wirequestion({ error, data }) {
        if (data) {
            this.question = data;
            console.log('this.question wire response',this.question.answers);
            this.error = undefined;
        } else if (error) {
            console.log('error-->',error);
            this.error = error;
            this.question = undefined;
        }
        this.loaded = true;
    }

    
}