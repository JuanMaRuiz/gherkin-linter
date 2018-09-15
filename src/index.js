const logger = require('./logger.js');

function getExitCode(results) {
  let exitCode = 0;
  results.forEach(result  => {
    if (result.errors.length > 0) {
      exitCode = 1;
    }
  });
  return exitCode;
}

const lint = function(results, format) {
  let formatter;
  if (format === 'json') {
    formatter = require('./formatters/json.js');
  } else if (!format || format == 'stylish') {
    formatter = require('./formatters/stylish.js');
  } else {
    logger.boldError('Unsupported format. The supported formats are json and stylish.');
    process.exit(1);
  }
  formatter.printResults(results);
};

module.exports = {
  lint,
  getExitCode
};
