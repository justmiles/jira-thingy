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
          name: "Sync",
          functionName: "autoSync"
        },{
          name: "Configure",
          functionName: "setCreds"
        }];
        ss.addMenu("Jira", menuEntries);
      }

      function doExport() {JiraThingyLib.doExport()}
      function doImport() {JiraThingyLib.doImport()}
      function setCreds() {JiraThingyLib.setCreds()}
      function autoSync() {JiraThingyLib.autoSync()}
      function mainOnEdit() {JiraThingyLib.mainOnEdit()}

1. Add the library `JiraThingyLib`. It's ID is: `1U-1SGmjFqQMGMbcguQgEmnVWqgb6qy9OyNoio7dBC1la2PjlGdhTSLAS`
  - Versions are in sync with the tagged versions on Github. Latest stable version will always be the latest tagged version
1. Configure Jira by selecting from the menu bar `Jira -> Configure`
1. Sync your spreadsheet with Jira by selecting `Jira -> Sync`