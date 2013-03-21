/*
 * Handle calls from the client
 */
Meteor.methods({
		SQLinsert: function (tableName, args) {
			var table = Devwik.SQL.tables[tableName];
			if(table.view) {
				var message = "Inserting into views is not supported:" + table.view.name;
				console.log(message);
				throw new Meteor.Error(message);
			}
			try {
				var statement = squel.insert().into(tableName);
				_.each(args, function(value, key) {
					value = Devwik.SQL.escape(value);
					statement.set(key, value);
				});

				console.log(statement.toString());
				var id = Devwik.SQL.execStatement(statement.toString());
			} catch (err) {
				console.log("Caught error:" + err);
				throw new Meteor.Error(err.message);
			}
			return(id.insertId);
		},
		SQLupdate: function (tableName, args, where) {
			var table = Devwik.SQL.tables[tableName];
			if(table.view) {
				var message = "Updating views is not supported::" + table.view.name;
				console.log(message);
				throw new Meteor.Error(message);
			}
			try {
				var statement = squel.update().table(tableName);
				_.each(args, function(value, key) {
					value = Devwik.SQL.escape(value);
					statement.set(key, value);
				});
				statement.where(where);
				console.log(statement.toString());
				var ret = Devwik.SQL.execStatement(statement.toString());
			} catch (err) {
				console.log("Caught error:" + err);
				throw new Meteor.Error(err.message);
			}
			return(ret);
		},
		SQLremove: function (tableName, criteria) {
			var table = Devwik.SQL.tables[tableName];
			if(table.view) {
				var message = "Deleting from views is not supported::" + table.view.name;
				console.log(message);
				throw new Meteor.Error(message);
			}
			try {
				criteria = Devwik.SQL.escape(criteria);
				var statement = 'delete from ' + tableName + ' ' +  criteria;
				console.log(statement);
				var ret = Devwik.SQL.execStatement(statement);
			} catch (err) {
				console.log("Caught error:" + err);
				throw new Meteor.Error(err.message);
			}
			return(ret);
		}
});
