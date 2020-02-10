
>>>> auth service:
------

data structures :
--
users collection is container for user (documents) 

User - {
    uid: string that is fbIdentifier,
    isLoggedIn : boolean,
    displayName : stirng,
    email: string,
    activeGroups: string[]
}

properties
--
authUser$ : Observable<User>

methods 
--
logon - single sign on logon / email-pwd logon

logoff - single sign on log off / email-pwd logoff

register - email/pwd/displayname 



>>>> groupchat service:
------

data structures :
--

groups collection is container for group document

group - { // when a group changes UI checks message count versus user count to determine what has changed and what to refresh
    id : string, // (fb identifier)
    groupId: string, // (name)
    messages : collection of messages,
    users : User[]
}



message - {
    fromUser : string (fb identifier),
    toUsers: string[] // empty or comma delimited userid list,
    msg:  string

}
