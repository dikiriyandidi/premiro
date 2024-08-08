var _super = Error.prototype,
    method = MyError.prototype = Object.create( _super );

method.constructor = MyError;

// function MyError() {
//     _super.constructor.apply( this, arguments );
// }

// Mudit [17/10/2018] add new param http_status_code
function MyError(message, http_status_code, code, option={}) {
    if (typeof code == 'undefined')
        code = http_status_code;

    _super.constructor.apply( this, arguments );
    this.message = message || 'Default Message'
    this.http_status_code = http_status_code // Mudit [17/10/2018] add http_status_code
    this.code = code
    this.option = option
}

module.exports = MyError;