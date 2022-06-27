import { LightningElement,api } from 'lwc';
import { FlowNavigationNextEvent } from 'lightning/flowSupport';

export default class NavigatePrevious extends LightningElement {
    @api
    availableActions = [];
   
    @api buttonvariant;

    @api
    label; //Label of the button

    @api
    buttonType; //Unique button Id

    @api
    selectedButtonType; //Property that'll store the buttonId

    handleNavigation() {

        this.selectedButtonType = this.buttonType; //Setting the buttonId when button is clicked.

        /** Navigating to next screen */
        if (this.availableActions.find(action => action === 'NEXT')) {
            const navigateNextEvent = new FlowNavigationNextEvent();
            this.dispatchEvent(navigateNextEvent);
        }
    }
}