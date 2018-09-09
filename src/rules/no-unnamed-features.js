const RULE = 'no-unnamed-features';

function run(feature) {
  let result = '';
  if (!feature || !feature.name) {
    result = {
      message: 'Missing Feature name',
      rule   : RULE,
      line   : feature.location && feature.location.line || 0
    };
  }
  return result;
}

module.exports = {
  name: RULE,
  run
};
