import { LightningElement, wire } from 'lwc';
import getWrapperClassList from '@salesforce/apex/IB_WrapperClass.getWrapperClassList'; 
// import  getQWrapperList from '@salesforce/apex/IB_QnAWrapper.method';


export default class iBQuestion extends LightningElement {
    @wire(getWrapperClassList)
    wrapperList;
    // @wire(getQWrapperList)
    // QWrapperList;

}