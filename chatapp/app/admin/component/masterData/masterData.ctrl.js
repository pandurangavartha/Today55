var db = require('../../../models/index')
module.exports = {
  
    userRoles: function (req, res) {
        models.Roles.find({}).exec(function (err, result) {
            result.push({ id: 4, title: 'Select Role' })
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
	 *   /create/masterData/roles:
	 *     get:
	 *       summary: create MasterRoles
	 *       description: create MasterRoles
	 *       tags: [MasterRoles]
	 *       produces:
	 *         - application/json
	 *       responses:
	 *         200:
	 *           description: Successfully created roles
	 *         400:
	 *           description: exception for required fieleds and validation
	 *         
	 */
    masterSchema: function (req, res) {
        let result = [{
            id: "1",
            title: "ADMIN"
        },
        {
            id: "2",
            title: "COMPANY-OWNER"
        },
        {
            id: "3",
            title: "USER"
        }
        ]

        models.Roles.find({}).exec(function (err, data) {
            if (data == '') {
                result.forEach(element => {
                    models.Roles(element).save()
                });
            }
            res.status(200).json({
                status: "success",
                message: "successfully added"
            })
        })
    }

}