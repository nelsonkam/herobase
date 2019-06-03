const {htm} = require('@zeit/integration-utils');

const Attachement = attachement => htm`
  <Box minWidth="302px" margin="8px 8px" boxShadow="0 4px 4px rgba(0, 0, 0, 0.12)" background="#fff" padding="16px" borderRadius="8px">
    <H1>${attachement.addon.name}</H1>
    <Box margin="12px 0" display="inline" fontSize="12px" border="1px solid #cfd7e6" color="#79589f" background="#f7f8fb" padding="0 5px" fontFamily="consolas,monaco,monospace" borderRadius="4px">${attachement.name}</Box>
    <Box display="flex" alignItems="center" marginTop="8px">
      <Box>Connected to </Box>
      <Box color="#79589f" marginLeft="4px">${attachement.app.name}</Box>
    </Box>
    <Box display="flex" justifyContent="space-between" alignItems="center" marginTop="8px">
      <Link target="_blank" href="${attachement.web_url}">View on Heroku</Link>
      <Button width="100px" action=${encodeURIComponent(`connect-db-${attachement.id}`)}>Connect</Button>
    </Box>
  </Box>
`

const Connection = connection => htm`
  <Box maxWidth="350px" margin="8px 8px" boxShadow="0 4px 4px rgba(0, 0, 0, 0.12)" background="#fff" padding="16px" borderRadius="8px">
    <H1>${connection.attachement.addon.name}</H1>
    <Box display="flex" alignItems="center" margin="12px 0" justifyContent="space-between">
      <Box fontWeight="bold">Env. Variable:</Box>
      <Box marginLeft="4px" display="inline" fontSize="12px" border="1px solid #cfd7e6" color="#79589f" background="#f7f8fb" padding="2px 5px" fontFamily="consolas,monaco,monospace" borderRadius="4px" lineHeight="1.2">${connection.envVariable}</Box>
    </Box>
    <Box display="flex" alignItems="center" margin="12px 0" justifyContent="space-between">
      <Box fontWeight="bold">Secret:</Box>
      <Box marginLeft="8px" display="inline" fontSize="12px" border="1px solid #cfd7e6" color="#79589f" background="#f7f8fb" padding="2px 5px" fontFamily="consolas,monaco,monospace" borderRadius="4px" lineHeight="1.2">${connection.secretName}</Box>
    </Box>
    <Box display="flex" justifyContent="space-between" alignItems="center" marginTop="8px">
      <Box display="flex" alignItems="center">
        <Box backgroundColor="rgb(80, 227, 194)" height="10px" width="10px" borderRadius="6px"></Box>
        <Box marginLeft="4px">Connected</Box>
      </Box>
      <Button themeColor="red" width="100px" action=${encodeURIComponent(`disconnect-db-${connection.id}`)}>Disconnect</Button>
    </Box>
  </Box>
`

const ConnectionsSection = connections => htm`
  <Box margin="18px 0">
    <Box margin="6px 0" marginLeft="8px" fontSize="28px" fontWeight="600">Connections</Box>
    <Box display="flex" flexWrap="wrap" margin="4px 0">
      ${connections.map(connection => Connection(connection))}
    </Box>
  </Box>
`

const DatastoreHeader = () => htm`
  <Box display="flex" justifyContent="space-between" alignItems="center">
    <Box margin="6px 0" marginLeft="8px" fontSize="28px" fontWeight="600">Heroku Datastores</Box>
    <Button action="create-datastore">Create datastore</Button>
  </Box>
`

const DatastoreSection = attachements => htm`
  <Box margin="32px 0">
    ${attachements.length > 0 
      ? DatastoreHeader() 
      : ""
    }
    <Box display="flex" flexWrap="wrap" margin="4px 0">
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

const Notice = (data) => htm`
  ${data ? htm`<Notice type="${data.type}">${data.message}</Notice>` : ""}
`

export {DatastoreEmptyState, DatastoreSection, DatastoreHeader, ConnectionsSection, Connection, Attachement, Notice}