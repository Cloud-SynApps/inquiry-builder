import { LightningElement, wire } from "lwc";
import sendSMS from "@salesforce/apex/TwilioService.sendSMS";

export default class TwilioSMS extends LightningElement {
  message = "";

  handleMessageOnChange(event) {
    this.message = event.target.value;
  }

  handleSMSSendClick() {
    console.log("send msg: " + this.message);
    if (this.message) {
      sendSMS({
        msg: this.message
      });
    } else {
      alert("Please entry message");
    }
  }
}