mainOnEdit = (context) ->
  Browser.msgBox 'yo?'
  ss = SpreadsheetApp.getActiveSpreadsheet()
  sheet = ss.getActiveSheet()
  issue = rowToJson(sheet, sheet.getActiveCell().getRow())
  if issue['Key']
    updateIssue issue
  return

# ---
# generated by js2coffee 2.2.0