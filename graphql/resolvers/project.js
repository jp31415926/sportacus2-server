const validator = require('validator');

const Project = require('../../models/project');
const catErrors = require('../../utils/catErrors');

const validateProjectInput = projectInput => {
	const errors = [];
	//console.log(projectInput);
	if (projectInput.name &&
		!validator.isLength(projectInput.name, { min: 2 })) {
		errors.push({ message: 'Project name too short!' });
	}
	if (projectInput.longName &&
		!validator.isLength(projectInput.longName, { min: 5 })) {
		errors.push({ message: 'Project longName too short!' });
	}
	// TODO: check lat and long
	// TODO: check street address, poc, parent ref
	if (errors.length > 0) {
		console.log(errors);
		const error = new Error(catErrors('Invalid input', errors));
		error.code = 422;
		throw error;
	}
}

const resolvers = {
	Mutation: {
		createProject: async (_, { projectInput }) => {
			validateProjectInput(projectInput);

			const errors = [];

			if (errors.length === 0) {
				const existingProjectName = await Project.findOne({ name: projectInput.name });
				if (existingProjectName) {
					errors.push({ message: 'Project name already used' });
				}
			}
			if (errors.length > 0) {
				//console.log(errors);
				const error = new Error(catErrors('Invalid input', errors));
				error.code = 422;
				throw error;
			}
			const project = new Project({
				name: projectInput.name,
				longName: projectInput.longName,
				startDate: projectInput.startDate,
				endDate: projectInput.endDate,
				archived: projectInput.archived,
			});

			return project.save()
				.then(() => {
					const result = {
						...project._doc,
					};
					//console.log(result);
					return result;
				})
				.catch(err => {
					errors.push({ message: err.toString() });
					const error = new Error(catErrors('Database error creating Project', errors));
					error.code = 422;
					throw error;
				});
		},

		updateProject: async (_, { _id, projectInput }) => {
			const errors = [];

			const projectOld = await Project.findById(_id);
			if (projectOld === null) {
				errors.push({ message: 'Project not found' });
			} else {
				validateProjectInput(projectInput);
				//console.log(projectInput);

				if (errors.length === 0) {
					const existingProjectName = await Project.findOne({ name: projectInput.name });
					if (existingProjectName && existingProjectName._id.toString() !== _id) {
						errors.push({ message: 'Project name already used' });
					}
				}
			}
			if (errors.length > 0) {
				const error = new Error(catErrors('Invalid input', errors));
				error.code = 422;
				throw error;
			}

			// update old project with new info
			projectOld.name = projectInput.name;
			projectOld.longName = projectInput.longName;
			projectOld.startDate = projectInput.startDate;
			projectOld.endDate = projectInput.endDate;
			projectOld.archived = projectInput.archived;

			return projectOld.save()
				.catch(err => {
					const error = new Error(catErrors('Database error updating Project; ' + err.toString(), errors));
					error.code = 422;
					throw error;
				})
				.then(() => {
					// TODO: should we return the database data? This requires that we do another query, possibly unnessarily
					return Project.findById(_id);
				})
				.then(project => {
					const result = {
						...project._doc,
					};
					return result;
				});
		},

		deleteProject: (_, { _id }) => {
			const errors = [];
			return Project.findByIdAndDelete(_id)
				.catch(err => {
					const error = new Error(catErrors('Database error updating Project; ' + err.toString(), errors));
					error.code = 422;
					throw error;
				})
				.then(res => {
					if (res) {
						return true;
					}
					const error = new Error('Project not found');
					error.code = 401;
					throw error;
				});
		},
	},

	Query: {
		getProject: async (_, { _id }) => {
			const project = await Project.findById(_id);
			if (!project) {
				const error = new Error('Project not found.');
				error.code = 401;
				throw error;
			}
			return {
				...project._doc,
			};
		},

		getProjects: async (_, { perPage = 20, page = 1 }) => {
			// TODO: does this need to be the number of total documents, or only the count that match the search???
			const total = await Project.countDocuments();
			// TODO: add filtering to query
			const items = await Project.find()
				.sort('createdAt')
				.skip((page - 1) * perPage)
				.limit(perPage);
			if (!items) {
				const error = new Error('No projects found that match criteria.');
				error.code = 401;
				throw error;
			}

			return {
				items: items.map(i => {
					return {
						...i._doc,
					}
				}),
				total: total,
			};
		},
	},
};

module.exports = resolvers;
