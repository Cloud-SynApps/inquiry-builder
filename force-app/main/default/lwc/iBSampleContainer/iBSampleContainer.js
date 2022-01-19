import { LightningElement, wire } from 'lwc';
import getQuestionsandAnswers from '@salesforce/apex/InquiryBuilderController.getQuestions';

export default class IBSampleContainer extends LightningElement {
    constructor()
    {
        super();
    }
    @wire(getQuestionsandAnswers) inquiry({ error, data }) {
        
        console.log('questions data-->',data);
    };
}