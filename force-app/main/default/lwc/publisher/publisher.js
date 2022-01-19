import { LightningElement,wire } from 'lwc';
import {CurrentPagerReference } from 'lightning/navigation';
import { fireEvent } from 'c/pubsub';

export default class Publisher extends LightningElement {
 @wire(CurrentPagerReference) pageRef;
 publishMessage(event){
     fireEvent(this.pageRef, 'messageEnd', 'this message comes from publisher');
 }
   

}