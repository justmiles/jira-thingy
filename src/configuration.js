
var ss = SpreadsheetApp.getActiveSpreadsheet()
var sheet = ss.getSheetByName('Configuration');
var configKeys = sheet.getRange(1,1,sheet.getLastRow()).getValues();
var configValues = sheet.getRange(1,2,sheet.getLastRow()).getValues();

var documentProperties = PropertiesService.getDocumentProperties();

for (configKeyIndex = 0, len = configKeys.length; configKeyIndex < len; configKeyIndex++) {
  configKey = configKeys[configKeyIndex];
  documentProperties.setProperty(configKey[0], configValues[configKeyIndex][0]);
}
