const {htm} = require('@zeit/integration-utils');

module.exports = () => htm`
  <Page>
    <Fieldset>
      <FsContent>
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" margin="48px">
          <Box marginBottom="26px" fontSize="28px" fontWeight="600">Select a project to get started</Box>
          <ProjectSwitcher />
        </Box>
      </FsContent>
    </Fieldset>
  </Page>
`