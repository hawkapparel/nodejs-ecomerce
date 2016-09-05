var connection = require('../connection'),
    util = require('util'),
    Promise = require('bluebird'),
    EventEmitter = require('events').EventEmitter,
    helper = require('../helper'),
    nestSet = require('./nestedSetModel');
var Category = function () {
};
util.inherits(Category, EventEmitter);
Category.prototype.saveCategory = function (data, parentId) {
    var self = this;
    if (helper.isUndefined(data.id)) {
        var insertPromise = new Promise(function (resolve, reject) {
            nestSet.once('get_node_info', function (result) {
                if (helper.isEmptyObject(result)) {
                    reject();
                } else {
                    resolve(helper.getFirstItemArray(result));
                }
            });
            nestSet.getNodeInfo(parentId);
        });

        insertPromise.then(function (parentInfo) {
            nestSet.once('insert_node', function (insertId) {
                self.emit('save_category', (insertId) ? true : false);
            });
            nestSet.insertNode(data, parentInfo);
        }).catch(function () {
            self.emit('save_category', false);
        });
    } else {
        var updatePromise = new Promise(function (resolve, reject) {
            nestSet.once('get_node_info', function (result) {
                if (helper.isEmptyObject(result)) {
                    reject();
                } else {
                    resolve(helper.getFirstItemArray(result));
                }
            });
            nestSet.getNodeInfo(parentId);
        });
    }
};
Category.prototype.listCat = function () {
    var self = this;
    connection.query(helper.buildQuery.select('*')
            .from('apt_categories')
            .where('`level` > 0')
            .orderBy('left', 'asc')
            .render(),
        function (err, res) {
            if (err) throw err;
            self.emit('list_category', res);
        });
};
Category.prototype.showCatById = function (id) {
    var self = this;
    connection.query(helper.buildQuery.select('*')
            .from('apt_categories')
            .where({id: id})
            .render(),
        function (err, res) {
            if (err) throw err;
            self.emit('show_category', helper.getFirstItemArray(res));
        });
};
module.exports = new Category();
