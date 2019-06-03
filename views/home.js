const {htm} = require('@zeit/integration-utils');
const {DatastoreSection, ConnectionsSection, Notice} = require('../components')

module.exports = (attachements, connections, noticeData) => htm`
  <Page>
    ${Notice(noticeData)}
    <Box marginLeft="8px"><ProjectSwitcher /></Box>
    ${connections.length > 0 ? ConnectionsSection(connections) : ""}
    ${DatastoreSection(attachements)}
  </Page>
`