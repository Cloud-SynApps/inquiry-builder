import { LightningElement, api } from 'lwc';

export default class ParentToChildCCmp extends LightningElement {
    @api getValueFromParent;
}