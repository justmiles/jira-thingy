var Jira = (function() {
  function Jira(version) {
    if (version == null) {
      this.version = 2;
    }
  }

  Jira.prototype._request = function(method, api, params, payload, callback) {
    var res, that = this;
    var response;
    var options, payloadString, req;
    if (params === null) {
      params = '';
    } else {
      params = toURL(params);
    }

    var path = api + params
    options = {
      'method': method,
      'Accept': 'application/json',
      'muteHttpExceptions': true,
      'headers': {
        'AuthenticationHeader': "Basic " + Utilities.base64Encode(this.username + ":" + this.password),
        'Authorization': "Basic " + Utilities.base64Encode(this.username + ":" + this.password),
        'Content-Type': 'application/json'
      }

    };

    if (payload !== null) {
      payloadString = JSON.stringify(payload)
      Logger.log('Payload string ' + payloadString);
      options.payload = payloadString;
    }

    Logger.log('https://' + that.host + path);
    Logger.log(options);

    res = UrlFetchApp.fetch('https://' + that.host + path, options);
    if (!res.getResponseCode().toString().match(/2[0-9][0-9]/)) {
      errMessage = "Error retrieving data for " + path + '. Recieved ' + res.getResponseCode()

      errors = JSON.parse(res.getContentText())['errors']
      Logger.log(errors)

      errorKeys = Object.keys(errors)
      for (var i = 0, len = errorKeys.length; i < len; i++) {
        error = errorKeys[i]
        errorMsg = errors[error]
        Logger.log(error)
        Logger.log(errorMsg)
        errMessage += "\n       " + error + ":  " + errorMsg + "\n\n"
      }

      return callback(errMessage, res);
    }
    var e, jsonResponse, msg;
    try {
      jsonResponse = JSON.parse(res.getContentText());
    } catch (_error) {
      e = _error;
      return callback(null, res.getContentText());
    }
    return callback(null, jsonResponse)

  };

  Jira.prototype.getIssue = function(issueID, params, callback) {
    return this._request("GET", "/rest/api/2/issue/" + issueID, params, null, callback);
  };

  Jira.prototype.createIssue = function(issue, params, callback) {
    if (params == null) {
      params = {};
    }
    return this._request("POST", "/rest/api/2/issue", params, issue, callback);
  };

  Jira.prototype.createRemoteLink = function(issueKey, url, title, callback) {
    var body;
    body = {
      object: {
        url: url,
        title: title
      }
    };
    return this._request("POST", "/rest/api/2/issue/" + issueKey + "/remotelink", null, body, callback);
  };

  Jira.prototype.setAssignee = function(issueKey, assignee, callback) {
    var body;
    body = {
      name: assignee
    };
    return this._request("PUT", "/rest/api/2/issue/" + issueKey + "/assignee", null, body, callback);
  };

  Jira.prototype.update = function(issueKey, params, payload, callback) {
    return this._request("PUT", "/rest/api/2/issue/" + issueKey, params, payload, callback);
  };


  Jira.prototype.transition = function(issueKey, params, payload, callback) {
    return this._request("POST", "/rest/api/2/issue/" + issueKey + "/transitions", params, payload, callback);
  };

  Jira.prototype.simpleSearch = function(query, params, callback) {
    if (params == null) {
      params = {};
    }
    params.jql = "text~" + query;
    return this._request("GET", "/rest/api/2/search", params, null, callback);
  };

  Jira.prototype.advancedSearch = function(jql, params, callback) {
    if (params == null) {
      params = {};
    }
    params.jql = jql;
    return this._request("GET", "/rest/api/2/search", params, null, callback);
  };

  return Jira;

})();