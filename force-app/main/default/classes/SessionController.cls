public with sharing class SessionController {
@AuraEnabled(cacheable=true)
public static List<Session__c> getSessions(String searchKey) {
  if (String.isBlank(searchKey)) {
    return [SELECT Id, Name, Location__c,toLabel(SessionRoom__c), Description__c, format(SessionDateTime__c) dateTime,
    (SELECT User__r.Id, User__r.Name, User__r.Description__c, User__r.Email, User__r.SmallPhotoUrl FROM SessionSpeakers__r)
    FROM Session__c ORDER BY CreatedDate DESC];
  } else {
    String key = '%' + searchKey + '%';
    return [SELECT Id, Name, Location__c, toLabel(SessionRoom__c), Description__c, format(SessionDateTime__c) dateTime,
    (SELECT User__r.Id, User__r.Name, User__r.Description__c, User__r.Email, User__r.SmallPhotoUrl FROM SessionSpeakers__r)
    FROM Session__c WHERE Name LIKE :key ORDER BY CreatedDate DESC];
  }
}
@AuraEnabled(cacheable=true)
public static List<Session__c> getallSessions() {
    return [SELECT Id, Name, Location__c, toLabel(SessionRoom__c), Description__c, format(SessionDateTime__c) dateTime,
    (SELECT User__r.Id, User__r.Name, User__r.Description__c, User__r.Email, User__r.SmallPhotoUrl FROM SessionSpeakers__r)
    FROM Session__c ORDER BY CreatedDate DESC LIMIT 5];
  }

@AuraEnabled(cacheable=true)
public static Session__c getSession(Id sessionId) {
  List<Session__c> sessions = [SELECT Id, Name, Location__c,toLabel(SessionRoom__c), Description__c, format(SessionDateTime__c) dateTime,
    (SELECT User__r.Id, User__r.Name, User__r.Description__c, User__r.Email, User__r.SmallPhotoUrl FROM SessionSpeakers__r)
    FROM Session__c WHERE Id = :sessionId ORDER BY CreatedDate DESC];
  if (sessions.isEmpty()) {
    throw new AuraHandledException('Could not find session');
  }
  return sessions[0];
}
@AuraEnabled
public static void addSpeakers(Id sessionId,List<String> speakers) {
  system.debug('sessionId==='+sessionId);
  system.debug('speakerList==='+speakers);
  List<SessionSpeakers__c> sessionSpeakerList = new List<SessionSpeakers__c>();
  for(String spstr : speakers){
    SessionSpeakers__c sp = new SessionSpeakers__c();
    sp.User__c =  spstr;
      sp.Session__c = sessionId;
      sessionSpeakerList.add(sp);
  }
  system.debug('sessionSpeakerList---'+sessionSpeakerList);
  if(!sessionSpeakerList.isEmpty()){
      insert sessionSpeakerList;
  }
}
}