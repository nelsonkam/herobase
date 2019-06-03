const axios = require("axios")
const cuid = require("cuid")
const {HEROKU_CLIENT_SECRET} = process.env;

export async function refreshToken(refreshToken) {
  return axios.post("https://id.heroku.com/oauth/token", null, {
    params: {
      grant_type: "refresh_token", refresh_token: refreshToken, client_secret: HEROKU_CLIENT_SECRET
    }
  }).then(res => {
    return res.data
  }).catch(err => console.log(err.response))
}

export async function removeSecret(zeitClient, name) {
  const deleteRes = await zeitClient.fetch(
    `/v2/now/secrets/${name}`,
    { method: 'DELETE' }
  );
  if (deleteRes.status !== 200 && deleteRes.status !== 404) {
    throw new Error(
      `Error when removing a secret: [${
        deleteRes.status
      }] ${await deleteRes.text()}`
    );
  }
}

export async function getHerokuClient(zeitClient, metadata) {
  const creationDate = metadata.herokuData.created
  if (creationDate + metadata.herokuData.expires_in > Date.now()) {
    const tokens = await refreshToken(metadata.herokuData.refresh_token)
    tokens.created = Date.now()
    metadata.herokuData = tokens
    await zeitClient.setMetadata(metadata)
  }
  return axios.create({
    baseURL: "https://api.heroku.com/",
    headers: {
      'Accept': 'application/vnd.heroku+json; version=3',
      'Content-type': 'application/json',
      'Authorization': 'Bearer ' + metadata.herokuData.access_token
    }
  })
}

export async function createOrGetHerokuApp(name, herokuClient) {
  const resp = await herokuClient.get("apps")
  const app = resp.data.filter(app => app.name.indexOf(name) > - 1)[0]
  if (!app) {
    const resp = await herokuClient.post("apps", {name: `${name}-${cuid.slug()}`})
    return resp.data 
  }
  return app
}

export async function getAttachementConfigURL(attachement, herokuClient, type) {
  const resp = await herokuClient.get("addons/" + attachement.addon.id + "/config");
  if (type === "postgresql") {
    return resp.data.filter(config => config.name === "url")[0];
  } else if (type === "redis") {
    return resp.data.filter(config => config.name === "URL")[0];
  } else {
    throw new Error('Unrecongnized type: ' + type)
  }
}

export async function connectAttachement(projectId, attachement, url, zeitClient, type) {
  const secretName = await zeitClient.ensureSecret(attachement.addon.name + "-url", url)
  let envVariable;
  if (type === "postgresql") {
    envVariable = attachement.name === 'DATABASE' ? 'HEROKU_DATABASE' : attachement.name
  } else if (type === "redis") {
    envVariable = attachement.name === 'REDIS' ? 'HEROKU_REDIS' : attachement.name
  } else {
    throw new Error('Unrecongnized type: ' + type)
  }
  envVariable += `_URL_${cuid.slug().toUpperCase().substring(0, 4)}`
  await zeitClient.upsertEnv(projectId, envVariable, secretName)
  return {envVariable, secretName}
}

export async function saveUserMetadata(userMetadata, metadata, zeitClient) {
  metadata[metadata.herokuData.user_id] = userMetadata
  await zeitClient.setMetadata(metadata)
}

export async function saveConnection(connection, projectId, userMetadata, metadata, zeitClient) {
  userMetadata.connections = userMetadata.connections || {};
  userMetadata.connections[projectId] = userMetadata.connections[projectId] || [];
  userMetadata.connections[projectId].push(connection)
  await saveUserMetadata(userMetadata, metadata, zeitClient)
  return userMetadata.connections[projectId]
}

export async function disconnectAttachement(connection, projectId, userMetadata, metadata, zeitClient) {
  const connections = userMetadata.connections[projectId];
  await removeSecret(zeitClient, connection.secretName)
  await zeitClient.removeEnv(projectId, connection.envVariable)
  userMetadata.connections[projectId] = connections.filter(conn => conn.id !== connection.id)
  await saveUserMetadata(userMetadata, metadata, zeitClient)
  return userMetadata.connections[projectId]
}

export function getProjectConnections(projectId, userMetadata) {
  const connections = userMetadata.connections || {};
  const projectConnections = connections[projectId] || [];
  return projectConnections;
}

export function filterDatastores(attachement) {
  return attachement.addon.name.indexOf("postgresql") > -1 || attachement.addon.name.indexOf("redis") > -1
}

export function getAttachementType(attachement) {
  return attachement.addon.name.split("-")[0];
}