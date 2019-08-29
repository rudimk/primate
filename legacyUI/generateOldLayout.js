// Run this in browser with old UI Running and dump the data to olderLayout.json.
// Then run filterTranslations.py to populate the translations files.
// This is hacky but perhaps more effort isn't needed. Migrate away to the new UI!
var loadFields = function (data, prefix) {
  if ($.type(data) !== 'object') return {}
  var allFields = {}
  var columnsOrder = {}
  $.each(Object.keys(data), function (idx, key) {
    if (key === 'fields') {
      var fields = data[key]
      var cols = ''
      if ($.type(data[key]) === 'object') {
        $.each(Object.keys(fields), function (idx1, fieldId) {
          if (allFields[fieldId]) {
            console.log('[WARN] Found multiple labels for API Key: ' + fieldId)
            allFields[fieldId].labels.push(fields[fieldId].label)
            allFields[fieldId].components.push(prefix)
          } else {
            allFields[fieldId] = {
              'labels': [fields[fieldId].label],
              'components': [prefix]
            }
          }
          cols = cols + "'" + fieldId + "', "
        })
      } else if ($.type(data[key]) === 'array') {
        $.each(fields, function (idx, fieldDict) {
          $.each(Object.keys(fieldDict), function (idx1, fieldId) {
            if (fieldDict.label) {
              if (allFields[fieldId]) {
                console.log('[WARN] Found multiple labels for API Key: ' + fieldId)
                allFields[fieldId].labels.push(fieldDict[fieldId].label)
                allFields[fieldId].components.push(prefix)
              } else {
                allFields[fieldId] = {
                  'labels': [fieldDict[fieldId].label],
                  'components': [prefix]
                }
              }
              cols = cols + "'" + fieldId + "', "
            }
          })
        })
      }
      columnsOrder[prefix] = cols.substring(0, cols.length - 2)
    } else if ($.type(data[key]) === 'object' && ($.type(key) !== 'string' || key.indexOf('$') === -1)) {
      var recRes = loadFields(data[key], prefix + '.' + key)
      $.extend(allFields, recRes.allFields)
      $.extend(columnsOrder, recRes.columnsOrder)
    }
  })
  return { 'allFields': allFields, 'columnsOrder': columnsOrder }
}
