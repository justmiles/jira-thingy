var syncEpics;

syncEpics = function() {
  var documentProperties, jira, userProperties;
  userProperties = PropertiesService.getUserProperties();
  documentProperties = PropertiesService.getDocumentProperties();
  jira = new Jira;
  jira.username = userProperties.getProperty('username');
  jira.password = userProperties.getProperty('password');
  jira.host = userProperties.getProperty('host');
  return jira.advancedSearch("\"Epic Name\" is not EMPTY AND project =" + (documentProperties.getProperty('Project Key')), {
    startAt: 0,
    maxResults: 1000
  }, function(err, res) {
    if (err) {
      Logger.log(err);
      return Browser.msgBox(err);
    } else {
      return async.each(res.issues, function(epic, callback) {
        var epicIssues;
        epicIssues = [];
        return jira.advancedSearch("\"Epic Link\" = " + epic.key, {
          startAt: 0
        }, function(err, res) {
          var epicIssue, i, len, ref;
          ref = res.issues;
          for (i = 0, len = ref.length; i < len; i++) {
            epicIssue = ref[i];
            epicIssues.push(issueToSheetRow(epicIssue));
          }
          jsonToSheet(epicIssues, getOrCreateSheet("Epic: " + epic['fields']['customfield_10009']));
          return callback();
        });
      });
    }
  });
};
