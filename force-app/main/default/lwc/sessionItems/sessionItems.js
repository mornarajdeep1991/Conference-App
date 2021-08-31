import { LightningElement, api } from 'lwc';

export default class SessionItems extends LightningElement {
@api session;
handleSessionClick(event) {
const { sessionId } = event.currentTarget.dataset;
const navigateEvent = new CustomEvent('navigate', {
    detail: sessionId
});
this.dispatchEvent(navigateEvent);
}

}