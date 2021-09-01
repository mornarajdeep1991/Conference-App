import { LightningElement, track, wire } from 'lwc';
import getSessions from '@salesforce/apex/SessionController.getSessions';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import  addSpeakers from  '@salesforce/apex/SessionController.addSpeakers';
export default class SessionList extends LightningElement {
@track sessions=[];
sessionId;
state = 'list';
@track selectedSpeakers=[];
@track pills = [];
@track selectedrecordname;
@track filters = {color: []};
@track searchKey = '';
@track bShowModal = false;
@wire(getSessions, { searchKey: '$searchKey' })
  
  wiredSessions({ error, data }) {
    if (data) {
      this.sessions = data;
    } else if (error) {
      this.sessions = [];
      throw new Error('Failed to retrieve sessions');
    }
  }
  openModal() {    
    this.bShowModal = true;
}

closeModal() {    
    this.bShowModal = false;
}
  
  handleSearchKeyInput(event) {
      clearTimeout(this.delayTimeout);
      const searchKey = event.target.value;
      this.delayTimeout = setTimeout(() => {
          this.searchKey = searchKey;
      }, 300);
    }

    // Handle sessions
    handleSuccess(event) {
      this.sessionId = event.detail.id;
      this.bShowModal = false;
      const evt = new ShowToastEvent({
        title: 'Success',
        message: 'Session created Successfully',
        variant: 'success',
        mode: 'dismissable'
    });
    this.dispatchEvent(evt);
      this.handleSpeakers();
    }

    // handle selected speakers
    handleSpeakers() {
        addSpeakers({ sessionId: this.sessionId , speakers :JSON.stringify(this.selectedSpeakers)})
          .then(result => {
              this.sessionId=null;
              this.speakerList=[];
          })
          .catch(error => {
                this.error=error;
          });
          location.reload();
  }
  
  // handle selected sesstion details
    handleNavigate(event) {
      this.sessionId = event.detail;
      const navigateEvent = new CustomEvent('sessiondetailsclick', {
        detail: this.sessionId
      });
      this.dispatchEvent(navigateEvent);
    }

    handleUserSelect(event){
      let selectedUser = {label:event.detail.userName}
      this.pills.push(selectedUser);
      this.selectedSpeakers.push(event.detail.userRecordId);
    }

    removeUser(event){
      const index = event.detail.index;
      const _item = this.pills;
      _item.splice(index, 1);
      this.pills = [..._item];
      const _userItems = this.selectedSpeakers;
      _userItems.splice(index, 1);
      this.selectedSpeakers = [..._userItems];
    }

    validate(event){
      if(this.selectedSpeakers.length<=0){
        const evt = new ShowToastEvent({
          title: 'Error',
          message: 'Speakers must be selected',
          variant: 'error',
          mode: 'dismissable'
      });
      this.dispatchEvent(evt);
      event.stopPropagation();
      event.preventDefault();
      }
      
    }
}
