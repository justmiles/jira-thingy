addNoteToActiveCell = (note) ->
  sheet = SpreadsheetApp.getActiveSpreadsheet()
  cell = sheet.getActiveSheet().getRange(1, 1, 1, 1)
  comments = cell.getComment()
  cell.setComment note
  return

getLastQuery = ->
  userProperties = PropertiesService.getUserProperties()
  lastquery = userProperties.getProperty('lastquery')
  Logger.log lastquery
  if lastquery == null
    'project = "IN" AND sprint in openSprints() AND type = Story'
  else
    lastquery

setLastQuery = (query) ->
  userProperties = PropertiesService.getUserProperties()
  userProperties.setProperty 'lastquery', query
  return

addCustomFields = (displayMap, fields) ->
  if displayMap == null
    displayMap = {}
  if fields == null
    fields = [ { 'customfield_11300': 'test' } ]
  documentProperties = PropertiesService.getDocumentProperties()
  ss = SpreadsheetApp.getActiveSpreadsheet()
  sheet = ss.getSheetByName('DataValidation')
  customFields = []
  i = 2
  len = sheet.getLastColumn() + 1
  while i < len
    name = sheet.getRange(1, i).getValues()[0][0]
    customFieldProperties = JSON.parse(documentProperties.getProperty('CUSTOM_FIELD_' + name))
    customFields.push customFieldProperties.id
    i++
  for key of fields
    if key.match(/^customfield_/)
      if fields[key] != null
        Logger.log 'Setting custom field: ' + key
        Logger.log 'Setting custom value: ' + issue.fields[key]
        if indexOf.call(customFields, field) >= 0
          displayMap[customFields[indexOf.call(customFields, field)]] = 'test'
  Logger.log JSON.stringify(displayMap)
  return

setCustomFields = ->
  documentProperties = PropertiesService.getDocumentProperties()
  documentProperties.setProperty 'CUSTOM_FIELD_Business Units', '{"id":"customfield_11300", "type":"object","set":"id","get":"value"}'
  documentProperties.setProperty 'CUSTOM_FIELD_Story Points', '{"id":"customfield_10004", "type":"string"}'
  return

getBusinessUnitId = (businessUnit) ->
  units =
    'AI (Augeo Incent)': '11000'
    'Augeo Digital': '12102'
    'CLO (Card Linked Offers)': '11001'
    'Creative': '11301'
    'FI (Financial Services Loyalty)': '11002'
    'Incentive Logic': '11003'
    'Internal IT': '11200'
    'Loyalty': '11004'
    'Membership': '11005'
    'Performance Plus': '11006'
    'Information Security': '11800'
  units[businessUnit]

jsonToActiveSpreadsheet = (jsonData) ->
  ss = SpreadsheetApp.getActiveSpreadsheet()
  sheets = ss.getSheets()
  sheet = ss.getActiveSheet()
  jsonToSheet jsonData, sheet
  return

jsonToSheet = (jsonData, sheet) ->
  rows = []
  headers = Object.keys(jsonData[0])
  sheet.clear contentsOnly: true
  rows.push headers
  i = 0
  while i < jsonData.length
    data = jsonData[i]
    row = []
    r = 0
    while r < headers.length
      row.push data[headers[r]]
      r++
    rows.push row
    i++
  dataRange = sheet.getRange(1, 1, rows.length, headers.length)
  dataRange.setValues rows
  
  # Set DataValidation if exists in the sheet "DataValidation"
  for header, ind in headers
    dataValidation = getDataValidtionForField(header)
    if dataValidation?
      range = sheet.getRange(2, ind + 1, sheet.getLastRow() - 1)
      range.setDataValidation dataValidation

activeSpreadsheetToJson = ->
  ss = SpreadsheetApp.getActiveSpreadsheet()
  sheets = ss.getSheets()
  sheet = ss.getActiveSheet()
  data = []
  rows = sheet.getDataRange().getValues()
  header = rows.shift()
  i = 0
  while i < rows.length
    row = rows[i]
    entry = {}
    r = 0
    while r < header.length
      entry[header[r]] = row[r]
      r++
    data.push entry
    i++
  data

toURL = (obj) ->
  '?' + Object.keys(obj).map((k) ->
    encodeURIComponent(k) + '=' + encodeURIComponent(obj[k])
  ).join('&')

showAlert = ->
  ui = SpreadsheetApp.getUi()
  # Same variations.
  result = ui.alert('Please confirm', 'Are you sure you want to continue?', ui.ButtonSet.YES_NO)
  # Process the user's response.
  if result == ui.Button.YES
    # User clicked "Yes".
    ui.alert 'Confirmation received.'
  else
    # User clicked "No" or X in the title bar.
    ui.alert 'Permission denied.'
  return

rowToJson = (sheet, row) ->
  keys = sheet.getRange('A1:I1').getValues()
  values = sheet.getRange('A' + row + ':I' + row + '').getValues()
  entry = {}
  r = 0
  while r < keys[0].length
    entry[keys[0][r]] = values[0][r]
    r++
  entry

syncSprintsdev = ->
  userProperties = PropertiesService.getUserProperties()
  documentProperties = PropertiesService.getDocumentProperties()
  jira = new Jira
  jira.username = userProperties.getProperty('username')
  jira.password = userProperties.getProperty('password')
  jira.host = userProperties.getProperty('host')
  jira.getAllBoards null, (err, res) ->
    Logger.log(err, res)