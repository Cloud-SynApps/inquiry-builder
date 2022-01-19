import { LightningElement,wire } from 'lwc';
//import getQuestionsandAnswers from '@salesforce/apex/InquiryBuilderController.getQuestions';

export default class IBStep extends LightningElement {
    constructor()
    {
        super();
    }

    /*@wire(getQuestionsandAnswers) questions({ error, data }) {
        console.log('questions data-->',data);
        console.log('questions error-->',error);
    };*/
    //console.log('questions-->',questions);
    
    elementList = [
        {
            id: 'a3b6g000001AtslAAC',
            recordId:'a3b6g000001AtslAAC',
            objectApiName:'CSA_Inquiry_Question__c',
            field:'Question_Content__c',
            variant:'label-hidden',
            size:10
        }/*,
        {
            id: '1235',
            type: 'checkbox',
            label: 'Is the organization currently insured?',
            size:6
        },
        {
            id: '1236',
            type: 'email',
            label: 'Enter email',
            size:12
        },*/
    ];
}