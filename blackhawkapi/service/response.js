let response = {
	status: 200,
	error: "",
	message: "",
	data: {},
};

module.exports = {
	/*handle validation error */
	_validationError: function (res, err, msg, data) {
		response.status = 422;
		response.error = err ? err : "";
		response.message = msg ? msg : "Something bad happened";
		response.data = data ? data : {};
		return res.status(422).send(response);
	},

	/*handle error if content required in request but request is empty */
	_noContent: function (res, info) {
		response.status = 404;
		response.message = info ? info : "No content found";
		response.error = info ? info : "No content found";
		response.data = {};
		return res.status(404).send(response);
	},

	/*handle status 500*/
	_handleError: function (res, err, msg,status) {
		response.status = status || 500;
		response.error = err ? err : "";
		response.message = msg ? msg : "Something bad happened";
		response.data = {};
		return res.status(status || 500).send(response);
	},

};
