/*
 * Routes for post 
 */
var message = require('./messages.ctrl')

app.post('/adduser/to/company', message.addusertocompany);
app.post('/messages/send', message.addMessages);
app.post('/images/send', message.addimages);
app.get('/messages/get/:recvrid/:page/:isbottom', message.getMessagesDetails);

app.get('/messages/count/:sendr_id/:recer_id', message.getMsgCount);
app.delete('/messages/delete/:id', message.delete);

app.get('/msg/get/users/:recvrid', message.getMessagesDetailsAdmin);
app.get('/messages/get/admin/access/:sendrid/:recvrid', message.getMessagesDetailsAdminList);





