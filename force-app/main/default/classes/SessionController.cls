public with sharing class SessionController {
@AuraEnabled(cacheable=true)
public static List<Session__c> getSessions(String searchKey) {
  if (String.isBlank(searchKey)) {
    return [SELECT Id, Name,toLabel(SessionRoom__c), Description__c, format(SessionDateTime__c) dateTime,
    (SELECT User__r.Id, User__r.Name, User__r.Description__c, User__r.Email, User__r.SmallPhotoUrl FROM SessionSpeakers__r)
    FROM Session__c ORDER BY SessionDateTime__c ASC];
  } else {
    String key = '%' + searchKey + '%';
    return [SELECT Id, Name, toLabel(SessionRoom__c), Description__c, format(SessionDateTime__c) dateTime,
    (SELECT User__r.Id, User__r.Name, User__r.Description__c, User__r.Email, User__r.SmallPhotoUrl FROM SessionSpeakers__r)
    FROM Session__c WHERE Name LIKE :key ORDER BY SessionDateTime__c ASC];
  }
}

@AuraEnabled(cacheable=true)
public static List<Session__c> getallSessions() {
    return [SELECT Id, Name, toLabel(SessionRoom__c), Description__c, format(SessionDateTime__c) dateTime,
    (SELECT User__r.Id, User__r.Name, User__r.Description__c, User__r.Email, User__r.SmallPhotoUrl FROM SessionSpeakers__r)
    FROM Session__c ORDER BY SessionDateTime__c ASC LIMIT 5];
  }

@AuraEnabled(cacheable=true)
public static Session__c getSession(Id sessionId) {
  List<Session__c> sessions = [SELECT Id, Name,toLabel(SessionRoom__c), Description__c, format(SessionDateTime__c) dateTime,
    (SELECT User__r.Id, User__r.Name, User__r.Description__c, User__r.Email, User__r.SmallPhotoUrl FROM SessionSpeakers__r)
    FROM Session__c WHERE Id = :sessionId ORDER BY SessionDateTime__c ASC];
  if (sessions.isEmpty()) {
    throw new AuraHandledException('Could not find session');
  }
  return sessions[0];
}

@AuraEnabled
public static void addSpeakers(Id sessionId,List<String> speakers) {
  List<SessionSpeakers__c> sessionSpeakerList = new List<SessionSpeakers__c>();
  for(String spstr : speakers){
    SessionSpeakers__c sp = new SessionSpeakers__c();
    sp.User__c =  spstr;
      sp.Session__c = sessionId;
      sessionSpeakerList.add(sp);
  }
  if(!sessionSpeakerList.isEmpty()){
      insert sessionSpeakerList;
  }
}
}