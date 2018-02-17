syncEpics = ->
  userProperties = PropertiesService.getUserProperties()
  documentProperties = PropertiesService.getDocumentProperties()
  
  jira = new Jira
  
  jira.username = userProperties.getProperty('username')
  jira.password = userProperties.getProperty('password')
  jira.host = userProperties.getProperty('host')
  jira.advancedSearch "\"Epic Name\" is not EMPTY AND project =#{documentProperties.getProperty('Project Key')}", {
    startAt: 0
    maxResults: 1000
  }, (err, res) ->
    if err
      Logger.log err
      Browser.msgBox err
    else
      
      async.each res.issues, (epic, callback) ->
        epicIssues = []
        jira.advancedSearch "\"Epic Link\" = #{epic.key}", {startAt: 0}, (err, res)->
          for epicIssue in res.issues
            epicIssues.push issueToSheetRow(epicIssue)
          jsonToSheet epicIssues, getOrCreateSheet("Epic: #{epic['fields']['customfield_10009']}")
          do callback