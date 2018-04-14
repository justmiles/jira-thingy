# Jira Thingy

I use this for sprint planning/review. It's useful to quickly manage Jira with each story as a simple line item

## Usage
1. First, create a new spreadsheet and add the following script

    function onOpen() {
      var ss = SpreadsheetApp.getActiveSpreadsheet();
      var menuEntries = [{
        name: "Jira -> Sheets",
        functionName: "doExport"
      }, {
        name: "Sheets -> Jira",
        functionName: "doImport"
      },{
        name: "Sync Sprints",
        functionName: "syncSprints"
      },{
        name: "Sync Epics",
        functionName: "syncEpics"
      },{
        name: "Reload Configs",
        functionName: "setScriptConfiguration"
      },{
        name: "Configure",
        functionName: "setCreds"
      }];
      ss.addMenu("Jira", menuEntries);
    }

    function doExport() {     JiraThingyLib.doExport()    }
    function doImport() {     JiraThingyLib.doImport()    }
    function setCreds() {     JiraThingyLib.setCreds()    }
    function syncSprints() {  JiraThingyLib.syncSprints() }
    function syncEpics() {    JiraThingyLib.syncEpics()   }
    function mainOnEdit() {   JiraThingyLib.mainOnEdit()  }
    function setScriptConfiguration() {   JiraThingyLib.setScriptConfiguration()  }



1. Add the library `JiraThingyLib`. It's ID is: `1Q0COyCUcQRaV4N90k8DLO3WKsvsOW0eNx90_5F0-M0PtWydpK2tkAf7C`
  - Versions are in sync with the tagged versions on Github. Latest stable version will always be the latest tagged version
  
2. Configure Jira by selecting from the menu bar `Jira -> Configure`

3. Sync your spreadsheet with Jira by selecting `Jira -> Sync`