var loadFields = function(data, prefix) {
	if ($.type(data) != "object") return {};
	var allFields = {};
	var columnsOrder = {};
	var colsString = "";
	$.each(Object.keys(data), function(idx, key) {
		if (key == "listView" && $.type(data[key]) == "object" && data.listView.fields) {
			var fields = data.listView.fields;
			var cols = "";
			$.each(Object.keys(fields), function(idx1, fieldId) {
				if (allFields[fieldId]) {
					console.log("[WARN] Found multiple labels for API Key: " + fieldId);
					allFields[fieldId].labels.push(fields[fieldId].label);
					allFields[fieldId].components.add(prefix);
				} else {
					allFields[fieldId] = {
						"labels": [fields[fieldId].label],
						"components": [prefix]
					};
				}
				cols = cols + "'" + fieldId + "', ";
			});
			columnsOrder[prefix] = cols.substring(0, cols.length-2);
		}
		else if ($.type(data[key]) == "object" && ($.type(key) != "string" || key.indexOf("$") == -1)) {
			var recRes = loadFields(data[key], prefix + "." + key);			
			$.extend(allFields, recRes.allFields);
			$.extend(columnsOrder, recRes.columnsOrder);
		}
	});
	return {"allFields": allFields, "columnsOrder" : columnsOrder};
};