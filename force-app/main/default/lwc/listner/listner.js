import { LightningElement,track,wire } from 'lwc';
import { CurrerntPageReference } from 'lightning/navigation';
import { registerListner, unregisterAllListners, fireEvent } from 'c/pubsub';


export default class Listner extends LightningElement {
@track message;
@wire(CurrerntPageReference) pageRef;
connectedCallback(){
    registerListner('messagesend', this.handlemessagesend, this);

}
handlemessagesend(publisherMessage){
    this.message = publisherMessage;
}
disconnectedCallback(){
    unregisterAllListners(this);
}
}