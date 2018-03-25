'use strict';

var _dataProvider = require('./data-provider');

var _dataProvider2 = _interopRequireDefault(_dataProvider);

var _baseDataProvider = require('./base-data-provider');

var _baseDataProvider2 = _interopRequireDefault(_baseDataProvider);

var _cachedBaseDataProvider = require('./cached-base-data-provider');

var _cachedBaseDataProvider2 = _interopRequireDefault(_cachedBaseDataProvider);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = { DataProvider: _dataProvider2.default, BaseDataProvider: _baseDataProvider2.default, CachedBaseDataProvider: _cachedBaseDataProvider2.default };