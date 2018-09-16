function getExitCode(results) {
  let exitCode = 0;
  results.forEach(result  => {
    if (result.errors.length > 0) {
      exitCode = 1;
    }
  });
  return exitCode;
}

function getReporter(format) {
  return ['stylish', 'json'].indexOf(format) === -1 ? 'stylish' : format;
}

const output = (results, format) => {
  const formatter = getReporter(format);
  const renderer = require(`./formatters/${formatter}.js`);
  renderer.printResults(results);
};

module.exports = {
  output,
  getExitCode
};
