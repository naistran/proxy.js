
var utils = require('../utils')
var route = require('path-match')()
var remotes = require('../lib/remotes')
var versions = require('../lib/versions')

var cacheControl = 'public, max-age='
  + require('../config').maxAge.versions

var calculate = utils.shasum
var localPath = utils.localPath
var match = route('/:user([\\w-]+)/:project([\\w-.]+)/versions.json')

/**
 * Return a list of all currently installed versions of a repository.
 */

module.exports = function* (next) {
  var params = match(this.request.path)
  if (!params) return yield* next

  var remote = remotes(this.req.hostname)
  if (!remote) this.throw(404, 'Unknown hostname.')
  var user = params.user.toLowerCase()
  var project = params.project.toLowerCase()
  var path = localPath(remote, user, project, '', '')
  var body = yield* versions(path)
  this.response.body = body
  this.response.etag = calculate(body)
  this.response.set('Cache-Control', cacheControl)
  if (this.request.fresh) this.response.status = 304
}
