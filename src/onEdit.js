function mainOnEdit(context) {
  Browser.msgBox('yo?')
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  var issue = rowToJson(sheet, sheet.getActiveCell().getRow())
  if (issue['Key']) {
    updateIssue(issue)
  }
}

rowToJson = function(sheet, row) {
  keys = sheet.getRange("A1:I1").getValues()
  values = sheet.getRange("A"+row+":I"+row+"").getValues()
  
  entry = {};
  for (r = 0; r < keys[0].length; r++) {
    entry[keys[0][r]] = values[0][r];
  }
  return entry
}