import { LightningElement, track, api } from 'lwc';
import imglightning from '@salesforce/resourceUrl/lwc';
export default class App extends LightningElement {
    @api sessionId;
    state = true;
 applogo = imglightning;
   handleSessionDetails(event){
    this.sessionId = event.detail;
    this.state = false;
    alert('conference main=='+this.sessionId);
   }
   gotoList(){
    this.sessionId = null;
    this.state = true;
   }
}
