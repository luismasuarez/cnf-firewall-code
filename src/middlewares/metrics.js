const deniedIPs = require('../data/deniedIPs')

let allowedRequests = 0;
let blockedRequests = 0;

function collect(req, res, next) {
  if (req.blocked) {
    blockedRequests++;
  } else {
    allowedRequests++;
  }
  next();
}

function report(req, res) {
  res.json({
    allowedRequests,
    blockedRequests,
    deniedIPs,
  });
}

module.exports = { collect, report, deniedIPs };
