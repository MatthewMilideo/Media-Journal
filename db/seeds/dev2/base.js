let users = [
	{
		email: "mmilideo@gmail.com",
		name: "Matthew",
	},
	{
		email: "tylerb7@gaol.com",
		name: "Tyler",
	},
	{
		email: "MJ@gmail.com",
		name: "MJ",
	},
	{
		email: "M5555J@gmail.com",
		name: "MJ",
	},
	{
		email: "MJ45@gmail.com",
		name: "MJ",
	},
	{
		email: "testboboboboboob@gmail.com",
		name: "Bo Bo Man",
	},
];

let media = [
	{
		title: "Star Wars",
		type: "MOVIE",
		CID: "11"
	},
	{
		title: "The Sopranos",
		type: "TV",
		CID: "2345"
	},
	{
		title: "The Trial",
		type: "BOOK",
		CID: "3456"
	}
];

let notes = [
	{
		title: "First Reformed - Note",
		data: "First Reformed is a very good movie and I like it a lot. "
	},
	{
		title: "The Sopranos - Note",
		data: "The Sopranos is a very good show and I like it a lot. "
	},
	{
		title: "The Trial - Note",
		data: "The Trial is a very good book and I like it a lot. "
	}
];

let tags = [
	{
		title: "Sad"
	},
	{
		title: "Good"
	},
	{
		title: "Funny"
	}
];



exports.seed = function(knex) {
	// We must return a Promise from within our seed function
	// Without this initial `return` statement, the seed execution
	// will end before the asynchronous tasks have completed
	let userIDs = [];
	let mediaIDs = [];
	let noteIDs = [];
	let tagsIDs = [];

	return (
		knex("user_media")
			.del() // delete all footnotes first
			.then(() => knex("media_note").del())
			.then(() => knex("note_tag").del())
			.then(() => knex("tags").del())
			.then(() => knex("notes").del())
			.then(() => knex("media").del())
			.then(() => knex("users").del())

			// Now that we have a clean slate, we can re-insert data
			.then(() => {
				return Promise.all([
					// Insert a single paper, return the paper ID, insert 2 footnotes
					knex("users")
						.insert(users, "id")
						.then(ids => {
							userIDs = ids;
							return knex("notes")
								.insert(
									[
										{
											title: "First Reformed - Note",
											data:
												"First Reformed is a very good movie and I like it a lot. ",
											user_id: userIDs[0]
										},
										{
											title: "First Reformed Note 2",
											data:
												"I love the movie First Reformed. It is very good. ",
											user_id: userIDs[0]
										},
										{
											title: "The Sopranos - Note",
											data:
												"The Sopranos is a very good show and I like it a lot. ",
											user_id: userIDs[1]
										},
										{
											title: "The Trial - Note",
											data:
												"The Trial is a very good book and I like it a lot. ",
											user_id: userIDs[2]
										},
										{
											title: "The Trial - Note 2",
											data:
												"Franz Kafka be doing it.",
											user_id: userIDs[3]
										},
										{
											title: "The Trial - Note 3",
											data:
												"I love court room drama!",
											user_id: userIDs[3]
										}
									],
									"id"
								)
								.then(ids => (noteIDs = ids));
						}),
					knex("media")
						.insert(media, "id")
						.then(ids => (mediaIDs = ids)),

					knex("tags")
						.insert(tags, "id")
						.then(ids => (tagIDs = ids))
				]); // end return Promise.all
			})
			.then(() => {
				return Promise.all([
					knex("media_note").insert([
						{
							media_id: mediaIDs[0],
							note_id: noteIDs[0],
							user_id: userIDs[0]
						},
						{
							media_id: mediaIDs[0],
							note_id: noteIDs[1],
							user_id: userIDs[0]
						},
						{
							media_id: mediaIDs[1],
							note_id: noteIDs[1],
							user_id: userIDs[0]
						},
						{
							media_id: mediaIDs[2],
							note_id: noteIDs[2],
							user_id: userIDs[1]
						},
						{
							media_id: mediaIDs[2],
							note_id: noteIDs[4],
							user_id: userIDs[2]
						},
						{
							media_id: mediaIDs[2],
							note_id: noteIDs[5],
							user_id: userIDs[2]
						}
					]),
					knex("note_tag").insert([

						{
							note_id: noteIDs[0],
							tag_id: tagIDs[0],
							user_id: userIDs[1]
						},
						{
							note_id: noteIDs[0],
							tag_id: tagIDs[1],
							user_id: userIDs[1]
						},
						{
							note_id: noteIDs[1],
							tag_id: tagIDs[0],
							user_id: userIDs[1]
						},
						{
							note_id: noteIDs[1],
							tag_id: tagIDs[1],
							user_id: userIDs[1]
						},
						{
							note_id: noteIDs[2],
							tag_id: tagIDs[0],
							user_id: userIDs[1]
						},
						{
							note_id: noteIDs[2],
							tag_id: tagIDs[1],
							user_id: userIDs[1]
						},
						{
							note_id: noteIDs[2],
							tag_id: tagIDs[2],
							user_id: userIDs[2]
						},
						{
							note_id: noteIDs[4],
							tag_id: tagIDs[0],
							user_id: userIDs[2]
						},
						{
							note_id: noteIDs[4],
							tag_id: tagIDs[1],
							user_id: userIDs[2]
						},
						{
							note_id: noteIDs[5],
							tag_id: tagIDs[0],
							user_id: userIDs[2]
						}
					]),
					knex("user_media").insert([
						{
							user_id: userIDs[0],
							media_id: mediaIDs[0]
						},
						{
							user_id: userIDs[0],
							media_id: mediaIDs[1]
						},
						{
							user_id: userIDs[0],
							media_id: mediaIDs[2]
						},
						{
							user_id: userIDs[1],
							media_id: mediaIDs[0]
						},
						{
							user_id: userIDs[1],
							media_id: mediaIDs[2]
						},
						{
							user_id: userIDs[2],
							media_id: mediaIDs[0]
						},
						{
							user_id: userIDs[2],
							media_id: mediaIDs[1]
						},
						{
							user_id: userIDs[2],
							media_id: mediaIDs[2]
						}
					])
				]);
			})
			.catch(error => console.log(`Error seeding data: ${error}`))
	);
};
