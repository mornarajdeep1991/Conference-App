import { LightningElement, api, track, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import search from '@salesforce/apex/SearchController.search';
const DELAY = 300;
export default class SearchComponent extends LightningElement {

@api valueId;
@api valueName;
@api objName = 'User';
@api iconName = 'standard:user';
@api labelName;
@api readOnly = false;
@api currentRecordId;
@api placeholder = 'Search User';
@api createRecord;
@api fields = ['Name'];
@api displayFields = 'Name, Email, Title';
@track searchText='';
@track error;

searchTerm;
delayTimeout;

searchRecords;
selectedRecord;
objectLabel;
isLoading = false;

field;
field1;
field2;

ICON_URL = '/apexpages/slds/latest/assets/icons/{0}-sprite/svg/symbols.svg#{1}';

 connectedCallback(){

    let icons           = this.iconName.split(':');
    this.ICON_URL       = this.ICON_URL.replace('{0}',icons[0]);
    this.ICON_URL       = this.ICON_URL.replace('{1}',icons[1]);
    if(this.objName.includes('__c')){

    }else{
        this.objectLabel = this.objName;
    }
    this.objectLabel    = this.titleCase(this.objectLabel);
    let fieldList;
    if( !Array.isArray(this.displayFields)){
        fieldList       = this.displayFields.split(',');
    }else{
        fieldList       = this.displayFields;
    }
    
    if(fieldList.length > 1){
        this.field  = fieldList[0].trim();
        this.field1 = fieldList[1].trim();
    }
    if(fieldList.length > 2){
        this.field2 = fieldList[2].trim();
    }
    let combinedFields = [];
    fieldList.forEach(field => {
        if( !this.fields.includes(field.trim()) ){
            combinedFields.push( field.trim() );
        }
    });

    this.fields = combinedFields.concat( JSON.parse(JSON.stringify(this.fields)) );
    
} 

handleInputChange(event){
    window.clearTimeout(this.delayTimeout);
    const searchKey = event.target.value;
    this.delayTimeout = setTimeout(() => {
        if(searchKey.length >= 2){
            search({ 
                objectName : this.objName,
                fields     : this.fields,
                searchTerm : searchKey 
            })
            .then(result => {
                let stringResult = JSON.stringify(result);
                let allResult    = JSON.parse(stringResult);
                allResult.forEach( record => {
                    record.FIELD1 = record[this.field];
                    record.FIELD2 = record[this.field1];
                    if( this.field2 ){
                        record.FIELD3 = record[this.field2];
                    }else{
                        record.FIELD3 = '';
                    }
                });
                this.searchRecords = allResult;
                
            })
            .catch(error => {
                console.error('Error:', error);
            })
            .finally( ()=>{
            });
        }
    }, DELAY);
}

handleSelect(event){
    
    let recordId = event.currentTarget.dataset.recordId;
    
    let selectRecord = this.searchRecords.find((item) => {
        return item.Id === recordId;
    });
    this.selectedRecord = selectRecord;

    const selectedEvent = new CustomEvent('userselect', {
        detail: {  
            
                userName          : selectRecord.Name,
                userRecordId        : recordId
            
        }
    }); 
    this.dispatchEvent(selectedEvent); 
    this.handleClose();
} 

handleClose(){
    this.searchText=null;
    this.selectedRecord = undefined;
    this.searchRecords  = undefined;
 
}

titleCase(string) {
    var sentence = string.toLowerCase().split(" ");
    for(var i = 0; i< sentence.length; i++){
        sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1);
    }
    return sentence;
}

}