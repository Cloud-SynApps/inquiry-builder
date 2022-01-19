import { LightningElement, wire } from 'lwc';
import getWrapperClassList from '@salesforce/apex/IB_WrapperClass.getWrapperClassList'; 

export default class IBAnswer extends LightningElement {
   @wire(getWrapperClassList)
   answers
}