'use strict';

import Path from 'path';
import Loader from 'app-module-path';
import { jsdom } from 'jsdom';

Loader.addPath(Path.resolve(__dirname, '..', 'src'));

global.window = jsdom().defaultView;
global.document = window.document;
global.navigator = window.navigator;
global.localStorage = window.localStorage;