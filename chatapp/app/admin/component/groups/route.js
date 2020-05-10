
/*
 * Routes for post 
 */
var group = require('./group.ctrl')

app.post('/group/create', group.creategroup);
app.get('/get/allgroups', group.getAllgroups);
app.get('/owner/get/groups/:created_by', group.getownerGroups);
app.put('/group/edit/:id', group.editGroup);
app.delete('/group/delete/:id', group.deleteGroup);
app.get('/group/:id', group.getGroupDetails);

app.post('/add/user/to/group', group.addUserToGroup);
app.get('/ger/userlist/:g_id', group.getGroupUsersList);

app.get('/get/groupchat/:g_id/:page/:isbottom', group.getGroupChatBygroupid);

app.get('/get/invited/groups/:u_id', group.getInvitedlist);

app.delete('/delete/group/user/:id', group.deleteGroupUser);

app.get('/group/notification/update/:id', group.groupNotificationUpdate);

app.put('/mute/notifications/:id',group.muteNotification)

app.get('/update/group/not/:uid/:gid', group.groupNotificationUpdateFromChat);
