const Note_Tag = require("../models/notes_tag_model");
const Tags = require("../models/tags_model");
const helpers = require("../models/model_helpers");
// Instantiate the controller object
const Note_TagController = {};

// Controller method for handling a request for all quotes
Note_TagController.getAllNT = (req, res) => {
	Note_Tag.getAllNT()
		.then(response => {
			res.status(response.status).send(response.data);
		})
		.catch(err => {
			res.status(err.status).send(err.data);
		});
};

Note_TagController.getNoteNT = (req, res) => {
	const { tag_id } = req.query;
	if (!helpers.checkParamsInt([tag_id]))
		return res.status(400).send("The tag_id must be a valid int.");
	Note_Tag.getNoteNT(tag_id)
		.then(response => {
			res.status(response.status).send(response.data);
		})
		.catch(err => {
			res.status(err.status).send(err.data);
		});
};

Note_TagController.getTagNT = (req, res) => {
	const { note_id } = req.query;
	if (!helpers.checkParamsInt([note_id]))
		return res.status(400).send("The note_id must be a valid int.");
	Note_Tag.getTagNT(note_id)
		.then(response => {
			res.status(response.status).send(response.data);
		})
		.catch(err => {
			res.status(err.status).send(err.data);
		});
};

Note_TagController.postNT = (req, res) => {
	const { note_id, tag_id, title } = req.body;
	if (!helpers.checkParamsInt([note_id, tag_id])) {
		return res.status(400).send("The note_id and tag_id must be valid ints.");
	}
	if (!helpers.checkParams([title])) {
		return res.status(400).send("The title must be a valid string.");
	}
	Note_Tag.postNT(note_id, tag_id)
		.then(response => {
			return res.status(response.status).send(response.data);
		})
		.catch(err => {
			if (err.status === 409) {
				return Tags.postTag(title)
					.then(data => {
						const { id, title } = data.data[0];
						if (!helpers.checkParamsInt([note_id, id])) {
							throw {
								status: 400,
								data:
									"The note_id and tag_id after posting the tag must be valid ints."
							};
						}
						if (!helpers.checkParams([title])) {
							throw {
								status: 400,
								data: "The title must be a valid string after posting the tag"
							};
						}
						return Note_Tag.postNT(note_id, id, title);
					})
					.then(data => {
						res.status(data.status).send(data.data);
					})
					.catch(error => {
						if (error.status) res.status(error.status).send(error.data);
						else res.status(500).send("unknown error");
					});
			}
			return res.status(err.status).send(err.data);
		});
};

Note_TagController.deleteNT = (req, res) => {
	const { note_id, tag_id } = req.body;

	if (!helpers.checkParamsInt([note_id, tag_id]))
		return res.status(400).send("The note_id and tag_id must be valid ints.");
	Note_Tag.deleteNT(note_id, tag_id)
		.then(response => {
			res.status(response.status).send(response.data);
		})
		.catch(err => {
			res.status(err.status).send(err.data);
		});
};

module.exports = Note_TagController;
