import { LightningElement, track, wire } from 'lwc';
import getSessions from '@salesforce/apex/SessionController.getSessions';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import  addSpeakers from  '@salesforce/apex/SessionController.addSpeakers';
export default class SessionList extends LightningElement {
@track sessions=[];
sessionId;
state = 'list';
@track selectedSpeakers=[];
@track removedSpeakers=[];
@track pills = [];
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
    // to open modal window set 'bShowModal' tarck value as true
    this.bShowModal = true;
}

closeModal() {    
    // to close modal window set 'bShowModal' tarck value as false
    this.bShowModal = false;
}
  
  handleSearchKeyInput(event) {
      clearTimeout(this.delayTimeout);
      const searchKey = event.target.value;
      // eslint-disable-next-line @lwc/lwc/no-async-operation
      this.delayTimeout = setTimeout(() => {
          this.searchKey = searchKey;
      }, 300);
    }
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
    // refreshApex(this.sessions);
    }
    handleSpeakers() {

      
    //  alert('this.sessionId '+this.sessionId);
      // alert('this.selectedSpeakers'+this.selectedSpeakers);
        addSpeakers({ sessionId: this.sessionId , speakers :this.selectedSpeakers})
          .then(result => {
              this.sessionId=null;
              this.speakerList=[];
          })
          .catch(error => {
                alert('errorrr=='+JSON.stringify(error));
          });
          location.reload();
  }
    handleNavigate(event) {
      this.sessionId = event.detail;
      const navigateEvent = new CustomEvent('sessiondetailsclick', {
        detail: this.sessionId
      });
      this.dispatchEvent(navigateEvent);
    }
    handleChange(event){
      //const fields = event.detail.fields;
      //fields.Name='';
      

      // alert('fields=='+JSON.stringify(this.template.querySelectorAll('lightning-input-field')));
    //  this.log(event.target);
      let dataName = event.target.dataset;
      // alert(dataName);
      let dval = event.target;
      // alert('dval---'+dval);
      // alert('test parse event'+JSON.stringify(event));
      // alert('test parse detail'+JSON.stringify(event.detail));
      let selectedrecordId = event.detail.value;
      

    //  alert('selectedrecordId---'+selectedrecordId);
      // alert('selectedrecordId length---'+selectedrecordId.length);
      if(selectedrecordId.length>0){
        // alert('inside val');
        this.filters.color.push( selectedrecordId );
        let _pills = [];
        for ( let i=0; i<this.pills.length; i++ ){
          //  alert('inside for');
          _pills.push ( this.pills[i] );
        }
        this.selectedSpeakers.push(selectedrecordId);
        // alert('this.selectedSpeakers=='+this.selectedSpeakers);
        _pills.push({label: dataName+':'+selectedrecordId, name: dataName});
        this.pills = _pills;
      }
      
      
      
      this.empty = '';
      // this.filterData();
    } 
    handleItemRemove (event) {
      const index = parseInt(event.detail.index);
      let _pills = [];
      for ( let i=0; i<this.pills.length; i++ ){
        let pill = this.pills[i];
        if ( i !== index ){
          _pills.push( pill );
          
        }
      }
      this.pills = _pills;
    /*  for ( let i=0; i<this.pills.length; i++ ){
        alert('inside for =='+i);
        let pill = this.pills[i];
        let spId = JSON.stringify(pill.label);
        let restring = spId.replace("[object DOMStringMap]:", "");
        this.removedSpeakers.push(restring);
        alert('removedspeakers='+this.removedSpeakers);
      }
      this.selectedSpeakers =[];
      selectedSpeakers.push(this.removedSpeakers);
      alert('selectedsp final=='+this.selectedSpeakers);*/
    }
    
}
