function autoSync() {
  var userProperties = PropertiesService.getUserProperties();
  var documentProperties = PropertiesService.getDocumentProperties();
  var jira = new Jira();
  jira.username = userProperties.getProperty('username');
  jira.password = userProperties.getProperty('password');
  jira.host = userProperties.getProperty('host');

  jira.advancedSearch('project = '+documentProperties.getProperty('Project Key')+' AND type = Story AND updatedDate > startOfYear()', {
    startAt: 0,
    maxResults: 1000
  }, function(err, res) {
    if (err) {
      Logger.log(err);
      Browser.msgBox(err);
    } else {
      var sprints = {}
      res.issues.map(function(issue) {
        var sprint = parseSprint(issue.fields.customfield_10007[0])
        if (!sprints[sprint.name]) {
          sprints[sprint.name] = []
        }
        sprints[sprint.name].push(issueToSheetRow(issue))
      });
      
      for (sprint in sprints) {
        issues = sprints[sprint];
        jsonToSheet(issues,getOrCreateSheet(sprint))
      }
    }
  });
}

var parseSprint = function(customfield_10007) {
  var re = new RegExp(/com.atlassian.greenhopper.service.sprint.Sprint@.*\[id=([0-9]+),rapidViewId=([0-9]+),state=([A-Za-z]+),name=([^,;]+),goal=([^,;]+)?,startDate=([^,;]+),endDate=([^,;]+),completeDate=([^,;]+),sequence=([^\];]+)/);
  var defaultSprintName = documentProperties.getProperty('Project Key') + ' Backlog'

  try {
    var cf = JSON.stringify(customfield_10007).match(re);
  } catch(e) {
    return {
      name: defaultSprintName
    }
  }
  
  if (!cf) {
    return {
      name: defaultSprintName
    }
  }

  return {
    id: cf[1],
    rapidViewId: cf[2],
    state: cf[3],
    name: cf[4],
    goal: cf[5],
    startDate: cf[6],
    endDate: cf[7],
    completeDate: cf[8],
    sequence: cf[9],
  }
}

var issueToSheetRow = function(issue) {
  return {
    'Project': issue.fields.project.key,
    'Key': issue.key,
    'Assignee': ((typeof issue.fields.assignee !== "undefined" && issue.fields.assignee !== null ? issue.fields.assignee.name : void 0) || ''),
    'Summary': issue.fields.summary,
    'Description': issue.fields.description,
    'Status': issue.fields.status.name,
    'Story Points': ((typeof issue.fields.customfield_10004 !== "undefined" && issue.fields.customfield_10004 !== null ? issue.fields.customfield_10004 : void 0) || ''),
    'Business Unit': ((issue.fields.customfield_11300 !== null ? issue.fields['customfield_11300'][0].value : void 0) || ''),
    'Priority': issue.fields.priority.name,
  }
}

var getOrCreateSheet = function(sheetName) {
  var ss = SpreadsheetApp.getActiveSpreadsheet()
  var sheet = ss.getSheetByName(sheetName);
  if (sheet != null) {
    return sheet
  } else {
    return ss.insertSheet(sheetName, {template: ss.getSheetByName('sprintTemplate')})
  }
}