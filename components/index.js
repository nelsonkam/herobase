const {htm} = require('@zeit/integration-utils');

const Attachement = attachement => htm`
<Box width="100%" margin="20px 0" boxShadow="0 4px 4px rgba(0, 0, 0, 0.12)" background="#fff" padding="32px" borderRadius="8px">
  <Box display="flex" alignItems="center" justifyContent="space-between">
    <Box fontSize="24px" fontWeight="700">${attachement.addon.name}</Box>
    <Link target="_blank" href="${attachement.web_url}">View on Heroku</Link>
  </Box>
  <Box display="flex" alignItems="center" justifyContent="space-between" marginTop="32px">
    <Box display="flex">
      <Box>
        <Box textTransform="uppercase" color="rgb(136, 136, 136)">Attachement name</Box>
        <Box fontFamily="consolas,monaco,monospace">${attachement.name}</Box>
      </Box>
      <Box width="1px" margin="0 24px" backgroundColor="#ccc"></Box>
      <Box>
        <Box textTransform="uppercase" color="rgb(136, 136, 136)">Heroku app</Box>
        <Box fontFamily="consolas,monaco,monospace">${attachement.app.name}</Box>
      </Box>
    </Box>
    <Button width="100px" action=${encodeURIComponent(`connect-db-${attachement.id}`)}>Connect</Button>
  </Box>
</Box>
`

const Connection = connection => htm`
<Box width="100%" margin="20px 0" boxShadow="0 4px 4px rgba(0, 0, 0, 0.12)" background="#fff" padding="32px" borderRadius="8px">
  <Box display="flex" alignItems="center" justifyContent="space-between">
    <Box fontSize="24px" fontWeight="700">${connection.attachement.addon.name}</Box>
    <Box display="flex" alignItems="center">
      <Box color="rgb(136, 136, 136)" marginRight="6px">Connected</Box>
      <Box backgroundColor="rgb(80, 227, 194)" height="10px" width="10px" borderRadius="6px"></Box>
    </Box>
  </Box>
  <Box display="flex" alignItems="center" justifyContent="space-between" marginTop="32px">
    <Box display="flex">
      <Box>
        <Box textTransform="uppercase" color="rgb(136, 136, 136)">Env. Variable</Box>
        <Box fontFamily="consolas,monaco,monospace">${connection.envVariable}</Box>
      </Box>
      <Box width="1px" margin="0 24px" backgroundColor="#ccc"></Box>
      <Box>
        <Box textTransform="uppercase" color="rgb(136, 136, 136)">Secret</Box>
        <Box fontFamily="consolas,monaco,monospace">${connection.secretName}</Box>
      </Box>
    </Box>
    <Button themeColor="red" width="100px" action=${encodeURIComponent(`disconnect-db-${connection.id}`)}>Disconnect</Button>
  </Box>
</Box>
`

const ConnectionsSection = connections => htm`
  <Box margin="32px 0 18px">
    <Box margin="6px 0" fontSize="28px" fontWeight="600">Connections</Box>
    <Box display="flex" flexWrap="wrap" margin="4px 0">
      ${connections.map(connection => Connection(connection))}
    </Box>
  </Box>
`

const DatastoreHeader = () => htm`
  <Box display="flex" justifyContent="space-between" alignItems="center">
    <Box margin="6px 0" fontSize="28px" fontWeight="600">Heroku Datastores</Box>
    <Button action="create-datastore" small>Create datastore</Button>
  </Box>
`

const DatastoreSection = attachements => htm`
  <Box margin="32px 0">
    ${attachements.length > 0 
      ? DatastoreHeader() 
      : ""
    }
    <Box margin="24px 0">
      ${attachements.map(attachement => Attachement(attachement))}
    </Box>
    ${attachements.length === 0 ? DatastoreEmptyState() : ""}
  </Box>
`

const DatastoreEmptyState = () => htm`
  <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" margin="48px">
    <Box marginBottom="12px" fontSize="22px" fontWeight="600">You don't have any datastore on Heroku</Box>
    <Box marginBottom="16px" fontSize="16px">You can create one <Link target="_blank" href="https://data.heroku.com">on Heroku</Link> or let us create one for you automagically.</Box>
    <Button action="create-datastore">Create a datastore</Button>
  </Box>
`

const Notice = data => htm`
  ${data ? htm`<Notice type="${data.type}">${data.message}</Notice>` : ""}
`

export {DatastoreEmptyState, DatastoreSection, DatastoreHeader, ConnectionsSection, Connection, Attachement, Notice}