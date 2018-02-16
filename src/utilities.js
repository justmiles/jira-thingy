function addNoteToActiveCell(note) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var cell = sheet.getActiveSheet().getRange(1, 1, 1, 1);
  var comments = cell.getComment();
  cell.setComment(note);
}

function getLastQuery() {
  var userProperties = PropertiesService.getUserProperties();
  lastquery = userProperties.getProperty('lastquery')
  Logger.log(lastquery)
  if (lastquery == null) {
    return 'project = "IN" AND sprint in openSprints() AND type = Story'
  } else {
    return lastquery
  }
}

function setLastQuery(query) {
  var userProperties = PropertiesService.getUserProperties();
  userProperties.setProperty('lastquery', query);
}

function addCustomFields(displayMap, fields) {
  if (displayMap == null) {
    displayMap = {};
  }
  if (fields == null) {
    fields = [{
      "customfield_11300": "test"
    }];
  }

  var documentProperties = PropertiesService.getDocumentProperties();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Custom Fields')
  var customFields = []
  for (i = 2, len = sheet.getLastColumn() + 1; i < len; i++) {
    var name = sheet.getRange(1, i).getValues()[0][0]
    customFieldProperties = JSON.parse(documentProperties.getProperty('CUSTOM_FIELD_' + name))
    customFields.push(customFieldProperties.id)
  }

  for (var key in fields) {
    if (key.match(/^customfield_/)) {
      if (fields[key] !== null) {
        Logger.log("Setting custom field: " + key)
        Logger.log("Setting custom value: " + issue.fields[key])
        if (indexOf.call(customFields, field) >= 0) {
          displayMap[customFields[indexOf.call(customFields, field)]] = 'test'
        }
      }
    }
  }


  Logger.log(JSON.stringify(displayMap))

};

function setCustomFields() {
  var documentProperties = PropertiesService.getDocumentProperties();
  documentProperties.setProperty('CUSTOM_FIELD_Business Units', '{"id":"customfield_11300", "type":"object","set":"id","get":"value"}');
  documentProperties.setProperty('CUSTOM_FIELD_Story Points', '{"id":"customfield_10004", "type":"string"}');
};

function getBusinessUnitId(businessUnit) {
  units = {
    "AI (Augeo Incent)": "11000",
    "Augeo Digital": "12102",
    "CLO (Card Linked Offers)": "11001",
    "Creative": "11301",
    "FI (Financial Services Loyalty)": "11002",
    "Incentive Logic": "11003",
    "Internal IT": "11200",
    "Loyalty": "11004",
    "Membership": "11005",
    "Performance Plus": "11006",
    "Information Security": "11800"
  }
  return units[businessUnit]
}



function jsonToActiveSpreadsheet(jsonData) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = ss.getSheets();
  var sheet = ss.getActiveSheet();
  jsonToSheet(jsonData, sheet)
}

function jsonToSheet(jsonData, sheet) {
  var rows = [];
  var header = Object.keys(jsonData[0]);

  sheet.clear({
    contentsOnly: true
  });
  rows.push(header);
  for (i = 0; i < jsonData.length; i++) {
    data = jsonData[i];
    row = [];
    for (r = 0; r < header.length; r++) {
      row.push(data[header[r]]);
    }
    rows.push(row);
  }

  dataRange = sheet.getRange(1, 1, rows.length, header.length);
  dataRange.setValues(rows);
}


function activeSpreadsheetToJson() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = ss.getSheets();
  var sheet = ss.getActiveSheet();
  var data = [];
  var rows = sheet.getDataRange().getValues();

  var header = rows.shift();

  for (i = 0; i < rows.length; i++) {
    row = rows[i];
    entry = {};
    for (r = 0; r < header.length; r++) {
      entry[header[r]] = row[r];
    }
    data.push(entry);
  }
  return data;
}

var toURL = function(obj) {
  return '?' + Object.keys(obj).map(function(k) {
    return encodeURIComponent(k) + '=' + encodeURIComponent(obj[k]);
  }).join('&');
};

function showAlert() {
  var ui = SpreadsheetApp.getUi(); // Same variations.

  var result = ui.alert(
    'Please confirm',
    'Are you sure you want to continue?',
    ui.ButtonSet.YES_NO);

  // Process the user's response.
  if (result == ui.Button.YES) {
    // User clicked "Yes".
    ui.alert('Confirmation received.');
  } else {
    // User clicked "No" or X in the title bar.
    ui.alert('Permission denied.');
  }
}