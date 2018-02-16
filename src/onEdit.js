function mainOnEdit(context) {
  Browser.msgBox('yo?')
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  var issue = rowToJson(sheet, sheet.getActiveCell().getRow())
  if (issue['Key']) {
    updateIssue(issue)
  }
}
