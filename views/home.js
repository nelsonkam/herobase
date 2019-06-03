const {htm} = require('@zeit/integration-utils');
const {DatastoreSection, ConnectionsSection, Notice} = require('../components')

module.exports = (attachements, connections, noticeData) => htm`
  <Page>
    ${Notice(noticeData)}
    <ProjectSwitcher />
    ${connections.length > 0 ? ConnectionsSection(connections) : ""}
    ${DatastoreSection(attachements)}
  </Page>
`