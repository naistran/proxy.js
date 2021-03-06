
var download = require('npm-download')()
var versions = require('npm-versions')()

exports.hostname = 'npmjs.org'
exports.aliases = [
  'npm.im',
  'www.npmjs.org',
  'registry.npmjs.org',
]

exports.caseSensitive = true
exports.namespace = false

exports.download = function* (repo, version, folder) {
  return yield* download(sanitize(repo), version, folder)
}

exports.versions = function* (repo) {
  return yield* versions(sanitize(repo))
}

function sanitize(repo) {
  return repo.replace(/^-\//, '')
}
