'use strict';

var path = require('path')
var async = require('async')
var _ = require('underscore')
var Client = require('../client/client')
var Contractor = require('../server/contractor')
var list = require('../client/list')
var utils = require('../utils')

var avilableAdapters = require('../client/adapt').avilableAdapters


var ip = utils.getExternalIpAddress()

var clientCfg = {
    tests: undefined,
    runner: undefined,
    adapter:undefined,
    override: false,
    platforms: undefined,
    clientRoot: undefined,
    timeout: 5,
    clientHost: ip,
    clientPort: '9998',
    serverHost: ip,
    serverPort: '9999'
}

var serverCfg = {
    serverHost : ip,
    serverPort : '9999'
}

module.exports = function(commander) {
    if (commander.server) {
        mixCommander(serverCfg, commander)
        new Contractor(serverCfg)
    } else if (commander.list) {
        mixCommander(clientCfg, commander)
        list(clientCfg)
    } else {
        mixCommander(clientCfg, commander)
        handleClientOption()
        var adapter = clientCfg.adapter

        if (adapter) {
            if (avilableAdapters.indexOf(adapter) < 0 && !utils.isAbsolute(adapter)) {
                clientCfg.adapter = path.join(process.cwd(), adapter)
            }
        }
        new Client(clientCfg)
    }
}

function handleClientOption() {
    ['runner', 'platforms'].map(function(name) {
        return require('./' + name)
    }).forEach(function(option) {
        option(clientCfg)
    })
}

function mixCommander(cfg, commander) {
    _.keys(cfg).forEach(function(key) {
        if (commander[key]) {
            cfg[key] = commander[key]
        }
    })
    return cfg
}