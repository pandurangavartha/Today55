module.exports = {
    /**
	 * @swagger
	 * paths:
	 *   /company/create:
	 *     post:
	 *       summary: Company Create
	 *       description: Company Create
	 *       tags: [Company]
	 *       parameters:
	 *         - name: body
	 *           description: Create Company
	 *           in: "body"
	 *           required: true
	 *           schema:
	 *             $ref: "#/definitions/company"
	 *       produces:
	 *         - application/json
	 *       responses:
	 *         200:
	 *           description: Success add Company
	 *         400:
	 *           description: exception for required fieleds and validation
	 * definitions:
	 *   company:
	 *     type: object
	 *     required:
	 *       - name
	 *       - email
     *       - user_id
	 *     properties:
	 *         name:
     *           type: string
	 *           example: pandu
	 *         email:
     *           type: email
	 *           example: pany@gmail.com
	 *         user_id:
     *           type: string
	 *           example: '3456hyuiqjko909'
	 *         
	 */
    addCompany: function (req, res) {
        var postData = req.body
        if (typeof postData.name != 'undefined' && postData.name != '') {
            models.Company(postData).save().then(function (result) {
                let temp = {}
                temp.user_id = postData.user_id;
                temp.company_id = result._id;
                if (requestUserId != undefined && requestUserId != null) {
                    temp.added_by = requestUserId;
                }
                models.companyusers(temp).save().then(function (cmpusrdata) {
                    res.status(200).json({
                        status: "success",
                        result: result
                    })
                })
            }).catch(function (err) {
                res.status(200).json({
                    status: false,
                    error: err
                })
            })
        } else {
            res.send({
                message: 'some fields are missing',
                sucess: false
            })
        }
    },
    /**
	 * @swagger
	 * paths:
	 *   /company/get/{id}:
	 *     get:
	 *       summary: Company Details
	 *       description: Company Details
	 *       tags: [Company]
	 *       parameters:
	 *        - name: "x-access-token"
     *          in: "header"
     *          required: true
     *          type: "string"
	 *        - name: id
	 *          description: company id
	 *          in: path
	 *          type: string
	 *          required: true
	 *       produces:
	 *         - application/json
	 *       responses:
	 *         200:
	 *           description: Successfully returned Details
	 *         400:
	 *           description: exception for required fieleds and validation
	 *         
	 */
    getCompanyDetails: function (req, res) {
        var condition = {
            _id: req.params.id
        }
        models.Company.findOne(condition).exec(function (err, result) {
            if (result) {
                res.status(200).json({
                    status: "success",
                    result: result
                })
            } else {
                res.status(200).json({
                    status: false,
                    error: "No records !"
                })
            }
        })
    },
     /**
	 * @swagger
	 * paths:
	 *   /company/particular/{id}:
	 *     get:
	 *       summary: Company Details
	 *       description: Company Details
	 *       tags: [Company]
	 *       parameters:
	 *        - name: "x-access-token"
     *          in: "header"
     *          required: true
     *          type: "string"
	 *        - name: id
	 *          description: user id
	 *          in: path
	 *          type: string
	 *          required: true
	 *       produces:
	 *         - application/json
	 *       responses:
	 *         200:
	 *           description: Successfully returned Details
	 *         400:
	 *           description: exception for required fieleds and validation
	 *         
	 */
    getParticularUserCompany: function (req, res) {
        var condition = {
            user_id: req.params.uid,
            company_id: {
                $ne: undefined
            },
        }
        models.companyusers.find(condition).populate({
            path: 'user_id'

        }).populate({
            path: 'company_id'

        }).populate({
            path: 'added_by'

        }).exec(function (err, result) {
            result.push({
                "company_id": {
                    _id: 4,
                    name: 'Select Company'
                }
            })
            if (result) {
                res.status(200).json({
                    status: "success",
                    result: result
                })
            } else {
                res.status(200).json({
                    status: false,
                    error: "No records !"
                })
            }
        })
    },
    /**
	 * @swagger
	 * paths:
	 *   /company/get:
	 *     get:
	 *       summary: Company list
	 *       description: Company list
	 *       tags: [Company]
	 *       parameters:
	 *        - name: "x-access-token"
     *          in: "header"
     *          required: true
     *          type: "string"
	 *       produces:
	 *         - application/json
	 *       responses:
	 *         200:
	 *           description: Successfully returned list
	 *         400:
	 *           description: exception for required fieleds and validation
	 *         
	 */
    getAllCompany: function (req, res) {
        models.Company.find({}).exec(function (err, result) {
            if (err) {
                res.status(200).json({
                    status: false,
                    error: err
                })
            } else if (result) {
                res.status(200).json({
                    status: "success",
                    result: result
                })
            } else {
                res.status(200).json({
                    status: false,
                    error: "No records !"
                })
            }
        })
    },
     /**
	 * @swagger
	 * paths:
	 *   /company/edit/{id}:
	 *     get:
	 *       summary: Company Details
	 *       description: Company Details
	 *       tags: [Company]
	 *       parameters:
	 *        - name: "x-access-token"
     *          in: "header"
     *          required: true
     *          type: "string"
	 *        - name: id
	 *          description: company id
	 *          in: path
	 *          type: string
	 *          required: true
	 *       produces:
	 *         - application/json
	 *       responses:
	 *         200:
	 *           description: Successfully returned Details
	 *         400:
	 *           description: exception for required fieleds and validation
	 *         
	 */
    editCompany: function (req, res) {
        var condition = {
            _id: req.params.id
        }
        var updateData = req.body
        models.Company.findOneAndUpdate(condition, updateData, {
            new: true
        }).exec(function (err, result) {
            if (err) {
                res.status(200).json({
                    status: false,
                    error: err
                })
            } else if (result) {
                res.status(200).json({
                    status: "success",
                    result: result
                })
            } else {
                res.status(200).json({
                    status: false,
                    error: "No records !"
                })
            }
        })
    },
     /**
	 * @swagger
	 * paths:
	 *   /company/delete/{id}:
	 *     delete:
	 *       summary: Company Details
	 *       description: Company Details
	 *       tags: [Company]
	 *       parameters:
	 *        - name: "x-access-token"
     *          in: "header"
     *          required: true
     *          type: "string"
	 *        - name: id
	 *          description: company id
	 *          in: path
	 *          type: string
	 *          required: true
	 *       produces:
	 *         - application/json
	 *       responses:
	 *         200:
	 *           description: Successfully returned Details
	 *         400:
	 *           description: exception for required fieleds and validation
	 *         
	 */
    deleteCompany: function (req, res) {
        var condition = {
            _id: req.params.id
        }
        models.Company.findOne(condition).exec(function (err, result) {
            if (err) {
                res.status(200).json({
                    status: false,
                    error: err
                })
            } else if (result) {
                models.companyusers.remove({ company_id: req.params.id }).then(function (obj) {
                    models.groupUsers.remove({ company_id: req.params.id }).then(function (obj) {
                        models.users.remove({ company_id: req.params.id }).then(function (obj) {
                            models.Company.remove(condition).then(function () {
                                res.status(200).json({
                                    status: "success",
                                    message: "Company deleted successfully"
                                })
                            })
                        })
                    })
                })
            } else {
                res.status(200).json({
                    status: false,
                    error: "No records !"
                })
            }
        })
    }


}