ss = SpreadsheetApp.getActiveSpreadsheet()
sheet = ss.getSheetByName('Configuration')
configKeys = sheet.getRange(1, 1, sheet.getLastRow()).getValues()
configValues = sheet.getRange(1, 2, sheet.getLastRow()).getValues()
documentProperties = PropertiesService.getDocumentProperties()
configKeyIndex = 0
len = configKeys.length
while configKeyIndex < len
  configKey = configKeys[configKeyIndex]
  documentProperties.setProperty configKey[0], configValues[configKeyIndex][0]
  configKeyIndex++