function doExport() {
  var search = Browser.inputBox('JQL Search', getLastQuery(), Browser.Buttons.OK_CANCEL)
  if (search == 'cancel') {
    return
  }

  var userProperties = PropertiesService.getUserProperties()
  var jira = new Jira()

  jira.username = userProperties.getProperty('username')
  jira.password = userProperties.getProperty('password')
  jira.host = userProperties.getProperty('host')
  jira.advancedSearch(search, {
    startAt: 0
  }, function(err, res) {
    if (err) {
      Logger.log(err)
      Browser.msgBox(err)
    } else {
      res.issues = res.issues.map(function(issue) {

        return issueToSheetRow(issue)

      })
      jsonToActiveSpreadsheet(res.issues)
      // TODO: setColumnDataValidation('Business Unit', "'Custom Fields'!B2:B4")
    }
  })

  setLastQuery(search)
  addNoteToActiveCell(search)

}

var sidebarErrors = []
var sidebarSuccesses = []

function doImport() {
  // TODO: update the status on import using 'transitions' https://docs.atlassian.com/jira/REST/cloud/#api/2/issue-getTransitions
  // TODO: add story points
  // TODO: Update spreadsheet data with any new values (key, reporter, etc)
  var userProperties = PropertiesService.getUserProperties()
  var jira = new Jira()
  jira.username = userProperties.getProperty('username')
  jira.password = userProperties.getProperty('password')
  jira.host = userProperties.getProperty('host')
  var issues = activeSpreadsheetToJson()
  var i, issue, len, sidebarSuccesses = []

  for (i = 0, len = issues.length; i < len; i++) {
    issue = issues[i]

    if (issue['Key']) {

      updateIssue(issue)

    } else if (issue['Summary']) {
      var payload = {
        "fields": {
          "project": {
            "key": issue['Project']
          },
          "summary": issue['Summary'],
          "description": issue['Description'],
          "assignee": {
            name: issue['Assignee']
          },
          "issuetype": {
            "name": (issue['Issue Type'] || 'Story')
          },
          "customfield_11300": [{ // Set business unit for augeo
            "id": getBusinessUnitId(issue['Business Unit'])
          }],
          "customfield_10004": (issue['Story Points'] || 0) // Set story points
        }
      }

      jira.createIssue(payload, null, function(err, res) {
        if (err) {
          Logger.log(err)
          sidebarErrors.push(err)
        } else {
          sidebarSuccesses.push('Successfully created ' + res)
        }
      })

    }


    showSidebar({
      sidebarErrors: sidebarErrors,
      sidebarSuccesses: sidebarSuccesses
    })

  }
}

function setCreds() {
  var userProperties = PropertiesService.getUserProperties()
  var username = Browser.inputBox('Jira Username', '', Browser.Buttons.OK)
  var password = Browser.inputBox('Jira Password', 'Enter your password. This is stored as data only accessable by your Google account.', Browser.Buttons.OK)
  var host = Browser.inputBox('Jira Host', 'The Jira host you connect to. For example, mycompany.atlassian.net', Browser.Buttons.OK)
  userProperties.setProperty('username', username)
  userProperties.setProperty('password', password)
  userProperties.setProperty('host', host)
}

function showSidebar(sidebarData) {
  var html = HtmlService.createTemplateFromFile('Sidebar')
  html.data = sidebarData
  SpreadsheetApp.getUi().showSidebar(html.evaluate())
}

function updateIssue(issue) {
  Logger.log('Updating issue')
  // Fields that can be updated: Assignee, Comment, Components, Description, Fix Versions, Labels, Priority, Summary, Affected Versions, Worklog
  // https://developer.atlassian.com/jiradev/jira-apis/jira-rest-apis/jira-rest-api-tutorials/updating-an-issue-via-the-jira-rest-apis
  payload = {
    update: {
      summary: [{
        set: issue['Summary']
      }],
      assignee: [{
        set: {
          name: issue['Assignee']
        }
      }],
      priority: [{
        set: {
          name: (issue['Priority'] || 'Normal')
        }
      }],
      description: [{
        set: issue['Description']
      }]
    }
  }

  if (issue['Story Points']) {
    payload.update['customfield_10004'] = [{
      set: issue['Story Points']
    }]
  }

  if (issue['Business Unit']) {
    payload.update['customfield_11300'] = [{
      set: [{
        "id": getBusinessUnitId(issue['Business Unit'])
      }]
    }]
  }


  var userProperties = PropertiesService.getUserProperties()
  var jira = new Jira()
  jira.username = userProperties.getProperty('username')
  jira.password = userProperties.getProperty('password')
  jira.host = userProperties.getProperty('host')
  jira.update(issue['Key'], null, payload, function(err, res) {
    if (err) {
      Logger.log(err)
      Logger.log(res)
      sidebarErrors.push(err)
    } else {
      Logger.log(res)
      sidebarSuccesses.push('Successfully created ' + res)
    }
  })

  showSidebar({
    sidebarErrors: sidebarErrors,
    sidebarSuccesses: sidebarSuccesses
  })

}