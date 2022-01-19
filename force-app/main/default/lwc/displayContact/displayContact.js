import { LightningElement , wire , api } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import ContFirstName from '@salesforce/schema/Contact.FirstName';
import ContLastName from '@salesforce/schema/Contact.LastName';
import ContPhone from '@salesforce/schema/Contact.Phone';
import ContEmail from '@salesforce/schema/Contact.Email';
import ContDepartment from '@salesforce/schema/Contact.Department';
import ContDescription from '@salesforce/schema/Contact.Description';
import { registerListener, unregisterAllListeners } from 'c/pubsub';
import { CurrentPageReference } from 'lightning/navigation';

const fields = [
    ContFirstName,
    ContLastName,
    ContPhone,
    ContEmail,
    ContDepartment,
    ContDescription
]
export default class DisplayContact extends LightningElement {

    @api conId;

    @wire(CurrentPageReference) pageRef;

    @wire(getRecord, { recordId :'$conId', fields})
    conrecord;

    connectedCallback(){
        registerListener('conselect', this.callBackMethod, this)
    }

    disconnectedCallback(){
       unregisterAllListeners(this); 
    }

    callBackMethod(payload){
        this.conId = payload;
    }

    get contactfound(){
        if(this.conId){
            return true;
        }
        return false;
    }
}