import { LightningElement,track } from 'lwc';

export default class Parent extends LightningElement {
@track message;
sendDataToChild(event){
    this.message = 'Message from Parent';
}


}