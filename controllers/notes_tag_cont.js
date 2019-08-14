// Import the Models 
const Note_Tag = require("../models/notes_tag_model");
const Tags = require("../models/tags_model");



const Note_TagController = {};

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
	Note_Tag.postNT(note_id, tag_id)
		.then(response => {
			return res.status(response.status).send(response.data);
		})
		.catch(err => {
			if (err.status === 403) {
				return Tags.postTag(title)
					.then(data => {
						const { id } = data.data[0];
						return Note_Tag.postNT(note_id, id);
					})
					.then(data => {
						res.status(data.status).send(data.data);
					})
					.catch(error => {
						if (error.status) res.status(error.status).send(error.data);
						else res.status(500).send("Unknown Error in Note_TagController.postNT");
					});
			}
			res.status(err.status).send(err.data);
		});
};

Note_TagController.deleteNT = (req, res) => {
	const { note_id, tag_id } = req.body;
	Note_Tag.deleteNT(note_id, tag_id)
		.then(response => {
			res.status(response.status).send(response.data);
		})
		.catch(err => {
			res.status(err.status).send(err.data);
		});
};

module.exports = Note_TagController;
