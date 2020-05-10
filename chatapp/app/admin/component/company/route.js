/*
 * Routes for post 
 */
var company = require('./company.ctrl')

app.post('/company/create', company.addCompany);
app.get('/company/get/:id', company.getCompanyDetails);
app.get('/company/get', company.getAllCompany);
app.put('/company/edit/:id', company.editCompany);
app.delete('/company/delete/:id', company.deleteCompany);
app.get('/company/particular/:uid', company.getParticularUserCompany
);


