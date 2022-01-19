import { LightningElement,wire } from 'lwc';
// import getWrapperClassList from '@salesforce/apex/IB_Container2Wrapper.getWrapperClassList';
import getQues from '@salesforce/apex/IB_QuestionHandler.getQuestionsWithRelatedAnswers';
// import { NavigationMixin } from 'lightning/navigation';
import getQuestion from '@salesforce/apex/InquiryBuilderController.getQuestion';
import getNextAction from '@salesforce/apex/InquiryBuilderController.getNextAction';

export default class IBContainer2 extends LightningElement {
    question;
    error;
    loaded = true;
    questionId = 'a3b6g000001AtsqAAC';
    selectedOption;
    selectedOptions;
    currentSelection;
    result = false;

    inquiryQ=true;
    inquiryNext=false;


    @wire(getQues)
    qList
    vary
    clickhandle() {
        this.vary = this.template.querySelector('lightning-input').value;
        console.log("vary value: "+ vary);        
        // this[NavigationMixin.Navigate]({
        //     type: 'standard__navItemPage',
        //     attributes: {
        //         apiName: this.IB_Question__c,
        //     }
        // });
    }
    
    // handleNext(event) {
    //     this.loaded = false;
    //     console.log('handleNext event',this.selectedOption);
    //     if(this.currentSelection == "a3d6g000000VhbLAAS")
    //     {
    //         this.question = null;
    //         this.result = true;
    //         this.loaded = true;
    //     }
    //     else
    //     {
    //         this.selectedOption = this.currentSelection;
    //     }
    // }


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

    Nexthandle(){
        if(this.inquiryQ){
            this.inquiryQ = false;
            this.inquiryNext = true;
        }
    }

    ans;
    inputHandler(event){
        this.ans = event.target.value;
        console.log('ans: '+this.ans);
    }

}