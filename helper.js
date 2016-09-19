var connection = require('./connection');
function Helper() {
    var _this = this;
    this.buildQuery = {
        query: '',
        select: function (params) {
            var sql = 'SELECT ';
            if (params !== '*') {
                params.forEach(function (value) {
                    if (params[params.length - 1] == value) {
                        sql += '`' + value + '` ';
                    }
                    else {
                        sql += '`' + value + '`, ';
                    }
                });
            }
            else {
                sql += '*';
            }
            _this.buildQuery.query = sql;
            return _this.buildQuery;
        },
        from: function (tbl) {
            _this.buildQuery.query += ' FROM `' + tbl + '`';
            return _this.buildQuery;
        },
        where: function (conditions) {
            if (typeof conditions == 'object') {
                conditions = _this.buildQuery._perpareCondition(conditions);
            }
            _this.buildQuery.query += (conditions) ? ' WHERE ' + conditions : '';
            return _this.buildQuery;
        },
        orderBy: function (field, sort) {
            _this.buildQuery.query += ' ORDER BY `' + field + '` ' + sort;
            return _this.buildQuery;
        },
        limit: function (limit, offset) {
            _this.buildQuery.query += connection.format(' LIMIT ? OFFSET ?', [limit, offset]);
            return _this.buildQuery;
        },
        render: function () {
            return _this.buildQuery.query;
        },
        _perpareCondition: function (conditions) {
            var condition = '';
            for (var index in conditions) {
                if (condition) {
                    condition += ' AND ';
                }
                condition += connection.format('`' + index + '` = ?', [conditions[index]]);
            }
            return condition;
        }
    };
}
Helper.prototype = {
    encodeBase64: function (str) {
        return new Buffer(str).toString('base64');
    },
    decodeBase64: function (hash) {
        return new Buffer(hash, 'base64').toString('ascii');
    },
    randomString: function (length) {
        if (typeof length == 'undefined') {
            length = 20;
        }
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < length; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    },
    sendEmail: function (to, subject, content, callback) {
        var mailer = require("nodemailer");
        var smtpTransport = mailer.createTransport("SMTP", {
            service: "Gmail",
            auth: {
                user: 'tuananhdev200898@gmail.com',
                pass: 'ttlpta840465'
            }
        });
        var mailOptions = {
            to: to,
            subject: subject,
            text: content
        };
        smtpTransport.sendMail(mailOptions, callback);
    },
    getFirstItemArray: function (arr) {
        return arr[0];
    },
    isEmptyObject: function (obj) {
        return typeof obj != 'object' || (Object.keys(obj).length === 0 && obj.constructor === Object);
    },
    isUndefined: function (arg) {
        return typeof arg == 'undefined';
    }
};
module.exports = new Helper();
//# sourceMappingURL=helper.js.map