import { LightningElement } from 'lwc';

export default class ParentToChild extends LightningElement {
    // value="Greetings from parent";
    childText;

    childTextHandler(event){
        this.childText=event.detail;
    }
}