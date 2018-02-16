var getDataValidtionForField = function(field) {
  var ss = SpreadsheetApp.getActiveSpreadsheet()
  var sheet = ss.getSheetByName('Custom Fields');
  var range = sheet.getRange(1,1,1,sheet.getLastColumn());
  var dataValidationFields = range.getValues()[0]

  for (i = 0, len = dataValidationFields.length; i < len; i++) {
    dataValidationFieldName = dataValidationFields[i];
    if (field == dataValidationFieldName) {
      dataValidationRange = sheet.getRange(2, i+1, sheet.getLastRow())
      return SpreadsheetApp.newDataValidation().requireValueInRange(dataValidationRange).build();
    }
  }
  
}