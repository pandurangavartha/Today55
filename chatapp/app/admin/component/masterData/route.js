/*
 * Routes for post 
 */
var masterData = require('./masterData.ctrl')

app.get('/get/masterData/roles', masterData.userRoles);
app.get('/create/masterData/roles', masterData.masterSchema);


