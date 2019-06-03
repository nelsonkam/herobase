const {htm} = require('@zeit/integration-utils');
const {Notice} = require('../components')

module.exports = (noticeData) => htm`
<Page>
  ${Notice(noticeData)}
  <Fieldset>
    <FsContent>
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
        <Box margin="6px 0" fontSize="22px" fontWeight="600">Create a datastore</Box>
        <P>Choose the type of datastore you would like to create.</P>
      </Box>
      <Box display="flex" justifyContent="center" margin="32px">
        <Box maxWidth="200px" margin="0 16px" borderRadius="8px" display="flex" flexDirection="column" alignItems="center" padding="24px" boxShadow="0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)">
          <Box fontWeight="600" fontSize="18px">Heroku Postgres</Box>
          <Box height="1px" margin="16px 0" width="100%" background="#ccc" opacity="0.3"></Box>
          <Box fontSize="16px" textAlign="center">A relational SQL database</Box>
          <Box margin="16px 0 4px">
            <Link href="https://devcenter.heroku.com/articles/heroku-postgresql">Learn more</Link>
          </Box>
          <Box margin="8px 0 0">
            <Button width="200px" highlight action="create-datastore-postgresql">Create</Button>
          </Box>
        </Box>
        <Box maxWidth="200px" margin="0 16px" borderRadius="8px" display="flex" flexDirection="column" alignItems="center" padding="24px" boxShadow="0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)">
          <Box fontWeight="600" fontSize="18px">Heroku Redis</Box>
          <Box height="1px" margin="16px 0" width="100%" background="#ccc" opacity="0.3"></Box>
          <Box fontSize="16px" textAlign="center">A widely used key/value store.</Box>
          <Box margin="16px 0 4px">
            <Link href="https://devcenter.heroku.com/articles/heroku-redis">Learn more</Link>
          </Box>
          <Box margin="8px 0 0">
            <Button width="200px" highlight action="create-datastore-redis">Create</Button>
          </Box>
        </Box>
      </Box>
      <Box display="flex" justifyContent="center" margin="24px 0 12px">
        <Link action="view">I'll do this later.</Link>
      </Box>
    </FsContent>
  </Fieldset>
</Page>
`