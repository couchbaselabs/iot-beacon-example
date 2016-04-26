var Model = require("./model");

var appRouter = function(app) {

    app.get("/", function(req, res) {
        Model.getAll(function(error, result) {
            if(error) {
                return res.status(400).send({"status": "error"});
            }
            res.send(result);
        });
    });

};

module.exports = appRouter;
