setScriptConfiguration = () ->
  documentProperties = PropertiesService.getDocumentProperties()
  
  ss = SpreadsheetApp.getActiveSpreadsheet()
  sheet = ss.getSheetByName('Configuration')
  configKeys = sheet.getRange(2, 1, sheet.getLastRow()).getValues()
  configValues = sheet.getRange(2, 2, sheet.getLastRow()).getValues()
  
  for configKey, i in configKeys
    configKey = configKey[0]
    configValue = configValues[i][0]
    unless configKey == ""
      Logger.log "Setting #{configKey} to #{configValue}"
      documentProperties.setProperty configKey, configValue
