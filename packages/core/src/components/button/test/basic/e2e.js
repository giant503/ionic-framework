const { register, navigate } = require('../../../../../scripts/e2e');

describe('button: basic', () => {

  register('navigates', navigate('http://localhost:3333/src/components/button/test/basic'));

});
