import { LightningElement,track,wire } from 'lwc';
import webResource from '@salesforce/apex/IB_WebResourceController.webResource';
//import getResourceActions from '@salesforce/apex/IB_WebResourceController.getResourceActions';
export default class IBResource extends LightningElement {

    @track questionId;
    @wire(webResource) resources;
    handleSelect(event){
        event.preventDefault();
        const selectEvent = new CustomEvent('resourceselect',{
            detail: {IB_Resource__c: event.currentTarget.dataset.questionId}});
            this.dispatchEvent(selectEvent);
    }
    
}