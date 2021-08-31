public with sharing class SessionController {
  @AuraEnabled(cacheable=true)
  public static List<Session__c> getSessions(String searchKey) {
    if (String.isBlank(searchKey)) {
      return [SELECT Id, Name, Location__c,toLabel(SessionRoom__c), Description__c, format(SessionDateTime__c) dateTime,
      (SELECT User__r.Id, User__r.Name, User__r.Description__c, User__r.Email, User__r.SmallPhotoUrl FROM SessionSpeakers__r)
      FROM Session__c];
    } else {
      String key = '%' + searchKey + '%';
      return [SELECT Id, Name, Location__c, toLabel(SessionRoom__c), Description__c, format(SessionDateTime__c) dateTime,
      (SELECT User__r.Id, User__r.Name, User__r.Description__c, User__r.Email, User__r.SmallPhotoUrl FROM SessionSpeakers__r)
      FROM Session__c WHERE Name LIKE :key];
    }
  }
  @AuraEnabled(cacheable=true)
  public static Session__c getSession(Id sessionId) {
    List<Session__c> sessions = [SELECT Id, Name, Location__c,toLabel(SessionRoom__c), Description__c, format(SessionDateTime__c) dateTime,
      (SELECT User__r.Id, User__r.Name, User__r.Description__c, User__r.Email, User__r.SmallPhotoUrl FROM SessionSpeakers__r)
      FROM Session__c WHERE Id = :sessionId ORDER BY SessionDateTime__c ASC];
    if (sessions.size() != 1) {
      throw new AuraHandledException('Could not find session');
    }
    return sessions[0];
  }
  @AuraEnabled
  public static void addSpeakers(Id sessionId,List<List<String>> speakers) {
    system.debug('sessionId==='+sessionId);
    system.debug('speakerList==='+speakers);
   // List<String> speakerList = (List<String>)JSON.deserialize(speakers,List<String>.class);
   // system.debug('m===='+speakerList);
    
    List<SessionSpeakers__c> sessionSpeakerList = new List<SessionSpeakers__c>();
    for(List<String> spstr : speakers){
       for(String spkr : spstr){
      SessionSpeakers__c sp = new SessionSpeakers__c();
      sp.User__c =  spkr;
        sp.Session__c = sessionId;
        sessionSpeakerList.add(sp);
    }
  }
    system.debug('sessionSpeakerList---'+sessionSpeakerList);
    if(!sessionSpeakerList.isEmpty()){
       insert sessionSpeakerList;
    } 



  }

}