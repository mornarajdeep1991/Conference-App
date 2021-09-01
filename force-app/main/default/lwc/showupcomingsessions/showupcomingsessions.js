import { LightningElement, api, track, wire } from 'lwc';
import getallSessions from '@salesforce/apex/SessionController.getallSessions';
export default class Showupcomingsessions extends LightningElement {
@track sessions=[];
@api session;
sessionId;
@wire(getallSessions)
wiredSession({ error, data }) {
  if (data) {
    this.sessions = data;
  } else if (error) {
    this.sessions = undefined;
    throw new Error('Failed to retrieve sessions');
  }
}
}