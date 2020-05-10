/*
 * Routes for post 
 */
var users = require('./users.ctrl')

app.post('/user/register', users.registerUsers);
app.post('/user/login', users.login);
app.post('/user/sociallogin', users.Sociallogin);
app.get('/user/:id', users.getUsers);
app.get('/user', users.getAllUsers);
app.put('/user/:id', users.editUsers);
app.delete('/user/:id', users.deleteUsers);
app.get('/users/:company_id', users.compnyUsers);
app.get('/notification/:s_id/:r_id/:msg', users.notificationUpdate);

app.get('/users/company/:company_id', users.compnyUserslist);

app.post('/user/forgotPassword', users.forgotPassword);
app.post('/user/updatePassword', users.updatePassword);

app.post('/user/changePassword', users.changePassword);




