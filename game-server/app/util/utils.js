var utils = module.exports;
var logger = require('pomelo-logger').getLogger(__filename);
// control variable of func "myPrint"
var isPrintFlag = false;
// var isPrintFlag = true;
var pomelo = require('pomelo');
/**
 * Check and invoke callback function
 */
utils.invokeCallback = function(cb) {
  if(!!cb && typeof cb === 'function') {
    cb.apply(null, Array.prototype.slice.call(arguments, 1));
  }
};

/**
 * clone an object
 */
utils.clone = function(origin) {
  if(!origin) {
    return;
  }

  var obj = {};
  for(var f in origin) {
    if(origin.hasOwnProperty(f)) {
      obj[f] = origin[f];
    }
  }
  return obj;
};

utils.size = function(obj) {
  if(!obj) {
    return 0;
  }

  var size = 0;
  for(var f in obj) {
    if(obj.hasOwnProperty(f)) {
      size++;
    }
  }

  return size;
};

// print the file name and the line number ~ begin
function getStack(){
  var orig = Error.prepareStackTrace;
  Error.prepareStackTrace = function(_, stack) {
    return stack;
  };
  var err = new Error();
  Error.captureStackTrace(err, arguments.callee);
  var stack = err.stack;
  Error.prepareStackTrace = orig;
  return stack;
}

function getFileName(stack) {
  return stack[1].getFileName();
}

function getLineNumber(stack){
  return stack[1].getLineNumber();
}

utils.myPrint = function() {
  if (isPrintFlag) {
    var len = arguments.length;
    if(len <= 0) {
      return;
    }
    var stack = getStack();
    var aimStr = '\'' + getFileName(stack) + '\' @' + getLineNumber(stack) + ' :\n';
    for(var i = 0; i < len; ++i) {
      aimStr += arguments[i] + ' ';
    }
    console.log('\n' + aimStr);
  }
};
utils.md5 = function(text){
  var crypto = require('crypto');
    return crypto.createHash('md5').update(text).digest('hex');
}
utils.checkUser = function (userid, password,cb){
  var pwdKey = "&^xxa*9)1]pxis";
  var md5password = utils.md5(utils.md5(password)+pwdKey);
  logger.error('md5password:' + md5password);
  var sql = 'select  *  from cx_member where phone = ? and pwd = ?';
  var args = [userid,md5password];
  pomelo.app.get('dbclient').query(sql,args,function(err, res){
      console.error("err in utils",err);
      console.error("res in utils",res);
      if (err !== null) {
          cb(err.message, null);
      } else {
          cb(null, res);
      }
  });
};
// print the file name and the line number ~ end

