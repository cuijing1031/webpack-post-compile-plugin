var util = require('./util')
var createPostCompilePlugin = require('./plugin')

const PostCompilePlugin = createPostCompilePlugin(updateRules)

function updateRules(compiler, pathsResult, entryPath, callback) {
  var ruleSetExec = function(data) {
    var ruleSet = data.ruleSet
    var _ruleSetExec = ruleSet.exec
    var effects = []

    ruleSet.exec = function (data) {
      effects = _ruleSetExec.call(this, data)

      // post compile true
      if (pathsResult[data.resource]) {
        // todo 如何针对于 pre 的 rule 过滤
        effects = _ruleSetExec.call(this, Object.assign(data, {
          resource: util.modifyPath(data.resource, entryPath)
        }))
      }
      return effects
    }
  }
  if (compiler.hooks) {
    compiler.hooks.normalModuleFactory.tap('PostCompilePlugin', ruleSetExec)
  }
  callback()
}

module.exports = PostCompilePlugin
