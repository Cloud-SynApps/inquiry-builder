import { LightningElement } from 'lwc';

export default class Termsofuse extends LightningElement {
    get options() {
        return [
            { label: 'I agree to the Solution Explorer Terms of Use', value: 'true' },
            
        ];
    }

    handleChange(e) {
        this.value = e.detail.value;
    }
}