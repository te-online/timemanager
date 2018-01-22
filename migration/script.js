var fs = require('fs');
var _ = require('underscore');
var UUID = require('uuid');

var data = fs.readFileSync('./migration.json');
data = JSON.parse(data)

// data.data.clients.created = _.map(data.data.clients.created, function(item) {
// 	item.uuid = UUID.v4();
// 	return item;
// });

// data.data.projects.created = _.map(data.data.projects.created, function(item) {
// 	item.uuid = UUID.v4();
// 	return item;
// });

// data.data.tasks.created = _.map(data.data.tasks.created, function(item) {
// 	item.uuid = UUID.v4();
// 	return item;
// });

// data.data.times.created = _.map(data.data.times.created, function(item) {
// 	item.uuid = UUID.v4();
// 	return item;
// });

// data.data.projects.created = _.map(data.data.projects.created, function(item) {
// 	var client = _.findWhere(data.data.clients.created, { id: parseInt(item.clientId) });
// 	item.client_uuid = client.uuid;
// 	delete item.clientId;
// 	return item;
// });

// data.data.tasks.created = _.map(data.data.tasks.created, function(item) {
// 	var project = _.findWhere(data.data.projects.created, { id: parseInt(item.projectId) });
// 	if(project) {
// 		item.project_uuid = project.uuid;
// 		delete item.projectId;
// 	} else {
// 		console.log("project", project, "task", item);
// 	}
// 	return item;
// });

// data.data.times.created = _.map(data.data.times.created, function(item) {
// 	var task = _.findWhere(data.data.tasks.created, { id: parseInt(item.taskId) });
// 	item.task_uuid = task.uuid;
// 	delete item.taskId;
// 	return item;
// });

// data.data.clients.created = _.map(data.data.clients.created, function(item) {
// 	delete item.apName;
// 	delete item.apVorname;
// 	delete item.apAnrede;
// 	delete item.
// 	return item;
// });

// data.data.projects.created = _.map(data.data.projects.created, function(item) {
// 	delete item.fertigBis;
// 	delete item.fertig;
// 	delete item.zeit;
// 	return item;
// });

// data.data.tasks.created = _.map(data.data.tasks.created, function(item) {
// 	delete item.fertigBis;
// 	delete item.zeit;
// 	return item;
// });

// data.data.times.created = _.map(data.data.times.created, function(item) {
// 	return item;
// });

console.log("clients", data.data.clients.created.length);
console.log("projects", data.data.projects.created.length);
console.log("tasks", data.data.tasks.created.length);
console.log("times", data.data.times.created.length);

// fs.writeFileSync('./migration_new.json', JSON.stringify(data, null, 2));