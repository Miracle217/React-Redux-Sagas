#!/usr/bin/env node
const fs = require('fs');
const shrinkwrap = require('../npm-shrinkwrap.json');

delete shrinkwrap.dependencies.fsevents;

fs.writeFileSync(__dirname + '/../npm-shrinkwrap.json', JSON.stringify(shrinkwrap, null, 2));