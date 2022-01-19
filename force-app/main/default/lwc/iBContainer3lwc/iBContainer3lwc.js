import { LightningElement,api } from 'lwc';

export default class IBContainer3lwc extends LightningElement {
    inquiryQ = true;
    inquiryNext = false;


    @api apiName='IB_Question__c';
    recordqId = 'a3k6g000001KEcmAAG';
    fields = ['Name'];

    @api ApiName='IB_Answer__c';
    recordId = 'a3i6g000002KApzAAG';
    fields = ['Name'];
   
   
    record2Id = 'a3i6g000002KApkAAG';
    fields = ['Name'];


    Nexthandle(){
        if(this.inquiryQ){
            this.inquiryQ = false;
            this.inquiryNext = true;
        }
    }

    Finishandle(){
        if(this.inquiryNext){
            this.inquiryQ = false;
            this.inquiryNext = false;
        }
    }
}