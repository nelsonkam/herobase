const {withUiHook, htm} = require('@zeit/integration-utils');
const cuid = require("cuid");
const {ROOT_URL} = process.env;
const { 
  getHerokuClient, 
  saveConnection, 
  getAttachementConfigURL, 
  getProjectConnections,
  disconnectAttachement,
  connectAttachement,
  createOrGetHerokuApp,
  filterDatastores,
  getAttachementType
} = require("./utils")

const homeView = require("./views/home")
const selectProjectView = require("./views/select-project")
const createDatastoreView = require("./views/create-datastore")


module.exports = withUiHook(async ({payload, zeitClient}) => {
  const connectUrl = `${ROOT_URL}/connect?next=${encodeURIComponent(payload.installationUrl)}`
  const metadata = await zeitClient.getMetadata()
  let client = null, dbAttachements, userMetadata;
  if (payload.query.access_token) {
    metadata.herokuData = payload.query
    await zeitClient.setMetadata(metadata)
    return selectProjectView()
  }

  if (metadata.herokuData) {
    client = await getHerokuClient(zeitClient, metadata);
    metadata[metadata.herokuData.user_id] = metadata[metadata.herokuData.user_id] || {};
    userMetadata = metadata[metadata.herokuData.user_id]
    const resp = await client.get("addon-attachments")
    dbAttachements = resp.data.filter(filterDatastores)
    dbAttachements.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
  }

  if (payload.project && payload.action === 'view') {
    resp = await client.get("addon-attachments")
    return homeView(dbAttachements, getProjectConnections(payload.projectId, userMetadata));
  }

  if (payload.action.indexOf("disconnect-db") === 0) {
    const id = payload.action.split("disconnect-db-")[1];
    let connections = getProjectConnections(payload.projectId, userMetadata);
    const connection = connections.filter(connection => connection.id === id)[0];
    connections = await disconnectAttachement(connection, payload.projectId, userMetadata, metadata, zeitClient);
    return homeView(dbAttachements, connections, {type: "success", message: `Heroku datastore: ${connection.attachement.addon.name} connection has been removed from ${payload.project.name}`})
  }

  if (payload.action.indexOf("connect-db") === 0) {
    const attachementId = payload.action.split("connect-db-")[1];
    const attachement = dbAttachements.filter(attachement => attachement.id === attachementId)[0];
    const type = getAttachementType(attachement);
    const urlConfig = await getAttachementConfigURL(attachement, client, type);
    const {envVariable, secretName} = await connectAttachement(payload.projectId, attachement, urlConfig.value, zeitClient, type);
    const connection = {id: `connection_${cuid()}`, secretName, envVariable, attachement, type};
    const connections = await saveConnection(connection, payload.projectId, userMetadata, metadata, zeitClient);
    return homeView(dbAttachements, connections, {type: "success", message: `Heroku datastore: ${attachement.addon.name} has been connected to ${payload.project.name}`})
  }

  if (payload.action === "create-datastore-postgresql") {
    const app = await createOrGetHerokuApp("herobase-zeit-now", client);
    const addon = await client.post(`apps/${app.name}/addons`, {plan: "heroku-postgresql:hobby-dev"})
    const resp = await client.get("addon-attachments")
    dbAttachements = resp.data.filter(filterDatastores)
    return homeView(dbAttachements, getProjectConnections(payload.projectId, userMetadata), {type: "success", message: `A new Postgres database: ${addon.data.name} has been created on Heroku`});
  }

  if (payload.action === "create-datastore-redis") {
    const account = await client.get("account")
    if (!account.data.verified) {
      return createDatastoreView({type: "error", message: htm`You need to verify your account with a credit card to install Heroku Redis. <Link target="_blank" href="https://heroku.com/verify"><Box color="white" display="inline" fontWeight="bold">Verify your account now.</Box></Link>`})
    }
    const app = await createOrGetHerokuApp("herobase-zeit-now", client);
    const addon = await client.post(`apps/${app.name}/addons`, {plan: "heroku-redis:hobby-dev"})
    const resp = await client.get("addon-attachments")
    dbAttachements = resp.data.filter(filterDatastores)
    dbAttachements.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
    return homeView(dbAttachements, getProjectConnections(payload.projectId, userMetadata), {type: "success", message: `A new Redis database: ${addon.data.name} has been created on Heroku`});
  }


  if (payload.action === "create-datastore") {
    return createDatastoreView()
  }
  
	return htm`
    <Page>
      <Fieldset>
        <FsContent>
          <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" margin="48px">
            <H1>Connect your Heroku account</H1>
            <Link href=${connectUrl}><Box color="white" backgroundColor="black" borderRadius="4px" padding="8px 16px" margin="16px">Connect With Heroku</Box></Link>
          </Box>
        </FsContent>
      </Fieldset>
		</Page>
	`
})