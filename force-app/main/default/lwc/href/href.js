import { LightningElement, wire} from 'lwc';
import getHref from '@salesforce/apex/Href.getHref';

export default class Href extends LightningElement {

    @wire(getHref)
    hrefs;

    get responseReceived(){
        if(this.hrefs){
            return true;
        }
        return false;
    }

}