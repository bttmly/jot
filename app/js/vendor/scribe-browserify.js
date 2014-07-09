!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.Scribe=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
var Scribe = _dereq_('../');
Scribe.plugins = _dereq_( './scribe-plugins' );
module.exports = Scribe;
},{"../":102,"./scribe-plugins":2}],2:[function(_dereq_,module,exports){
module.exports = {
  headingCommand: _dereq_( 'scribe-plugin-heading-command' ),
  codeCommand: _dereq_( 'scribe-plugin-code-command' ),
  blockquoteCommand: _dereq_( 'scribe-plugin-blockquote-command' ),
  linkPromptCommand: _dereq_( 'scribe-plugin-link-prompt-command' ),
  intelligentUnlinkCommand: _dereq_( 'scribe-plugin-intelligent-unlink-command' ),
  toolbar: _dereq_( 'scribe-plugin-toolbar' ),
  sanitizer: _dereq_( 'scribe-plugin-sanitizer' ),
  smartLists: _dereq_( 'scribe-plugin-smart-lists' ),
  keyboardShortcuts: _dereq_( 'scribe-plugin-keyboard-shortcuts' ),
  curlyQuotes: _dereq_( 'scribe-plugin-curly-quotes' ),
  formatterPlainTextConvertNewLinesToHtml: _dereq_( 'scribe-plugin-formatter-plain-text-convert-new-lines-to-html')
};
},{"scribe-plugin-blockquote-command":58,"scribe-plugin-code-command":59,"scribe-plugin-curly-quotes":60,"scribe-plugin-formatter-plain-text-convert-new-lines-to-html":61,"scribe-plugin-heading-command":62,"scribe-plugin-intelligent-unlink-command":63,"scribe-plugin-keyboard-shortcuts":64,"scribe-plugin-link-prompt-command":65,"scribe-plugin-sanitizer":67,"scribe-plugin-smart-lists":68,"scribe-plugin-toolbar":69}],3:[function(_dereq_,module,exports){
var baseFlatten = _dereq_('../internals/baseFlatten'), map = _dereq_('../collections/map');
function flatten(array, isShallow, callback, thisArg) {
    if (typeof isShallow != 'boolean' && isShallow != null) {
        thisArg = callback;
        callback = typeof isShallow != 'function' && thisArg && thisArg[isShallow] === array ? null : isShallow;
        isShallow = false;
    }
    if (callback != null) {
        array = map(array, callback, thisArg);
    }
    return baseFlatten(array, isShallow);
}
module.exports = flatten;
},{"../collections/map":8,"../internals/baseFlatten":18}],4:[function(_dereq_,module,exports){
var createCallback = _dereq_('../functions/createCallback'), slice = _dereq_('../internals/slice');
var undefined;
var nativeMax = Math.max;
function last(array, callback, thisArg) {
    var n = 0, length = array ? array.length : 0;
    if (typeof callback != 'number' && callback != null) {
        var index = length;
        callback = createCallback(callback, thisArg, 3);
        while (index-- && callback(array[index], index, array)) {
            n++;
        }
    } else {
        n = callback;
        if (n == null || thisArg) {
            return array ? array[length - 1] : undefined;
        }
    }
    return slice(array, nativeMax(0, length - n));
}
module.exports = last;
},{"../functions/createCallback":11,"../internals/slice":34}],5:[function(_dereq_,module,exports){
var arrayRef = [];
var splice = arrayRef.splice;
function pull(array) {
    var args = arguments, argsIndex = 0, argsLength = args.length, length = array ? array.length : 0;
    while (++argsIndex < argsLength) {
        var index = -1, value = args[argsIndex];
        while (++index < length) {
            if (array[index] === value) {
                splice.call(array, index--, 1);
                length--;
            }
        }
    }
    return array;
}
module.exports = pull;
},{}],6:[function(_dereq_,module,exports){
var baseIndexOf = _dereq_('../internals/baseIndexOf'), forOwn = _dereq_('../objects/forOwn'), isArray = _dereq_('../objects/isArray'), isString = _dereq_('../objects/isString');
var nativeMax = Math.max;
function contains(collection, target, fromIndex) {
    var index = -1, indexOf = baseIndexOf, length = collection ? collection.length : 0, result = false;
    fromIndex = (fromIndex < 0 ? nativeMax(0, length + fromIndex) : fromIndex) || 0;
    if (isArray(collection)) {
        result = indexOf(collection, target, fromIndex) > -1;
    } else if (typeof length == 'number') {
        result = (isString(collection) ? collection.indexOf(target, fromIndex) : indexOf(collection, target, fromIndex)) > -1;
    } else {
        forOwn(collection, function (value) {
            if (++index >= fromIndex) {
                return !(result = value === target);
            }
        });
    }
    return result;
}
module.exports = contains;
},{"../internals/baseIndexOf":19,"../objects/forOwn":40,"../objects/isArray":42,"../objects/isString":46}],7:[function(_dereq_,module,exports){
var baseCreateCallback = _dereq_('../internals/baseCreateCallback'), forOwn = _dereq_('../objects/forOwn');
function forEach(collection, callback, thisArg) {
    var index = -1, length = collection ? collection.length : 0;
    callback = callback && typeof thisArg == 'undefined' ? callback : baseCreateCallback(callback, thisArg, 3);
    if (typeof length == 'number') {
        while (++index < length) {
            if (callback(collection[index], index, collection) === false) {
                break;
            }
        }
    } else {
        forOwn(collection, callback);
    }
    return collection;
}
module.exports = forEach;
},{"../internals/baseCreateCallback":16,"../objects/forOwn":40}],8:[function(_dereq_,module,exports){
var createCallback = _dereq_('../functions/createCallback'), forOwn = _dereq_('../objects/forOwn');
function map(collection, callback, thisArg) {
    var index = -1, length = collection ? collection.length : 0;
    callback = createCallback(callback, thisArg, 3);
    if (typeof length == 'number') {
        var result = Array(length);
        while (++index < length) {
            result[index] = callback(collection[index], index, collection);
        }
    } else {
        result = [];
        forOwn(collection, function (value, key, collection) {
            result[++index] = callback(value, key, collection);
        });
    }
    return result;
}
module.exports = map;
},{"../functions/createCallback":11,"../objects/forOwn":40}],9:[function(_dereq_,module,exports){
var isString = _dereq_('../objects/isString'), slice = _dereq_('../internals/slice'), values = _dereq_('../objects/values');
function toArray(collection) {
    if (collection && typeof collection.length == 'number') {
        return slice(collection);
    }
    return values(collection);
}
module.exports = toArray;
},{"../internals/slice":34,"../objects/isString":46,"../objects/values":49}],10:[function(_dereq_,module,exports){
var createWrapper = _dereq_('../internals/createWrapper'), slice = _dereq_('../internals/slice');
function bind(func, thisArg) {
    return arguments.length > 2 ? createWrapper(func, 17, slice(arguments, 2), null, thisArg) : createWrapper(func, 1, null, null, thisArg);
}
module.exports = bind;
},{"../internals/createWrapper":22,"../internals/slice":34}],11:[function(_dereq_,module,exports){
var baseCreateCallback = _dereq_('../internals/baseCreateCallback'), baseIsEqual = _dereq_('../internals/baseIsEqual'), isObject = _dereq_('../objects/isObject'), keys = _dereq_('../objects/keys'), property = _dereq_('../utilities/property');
function createCallback(func, thisArg, argCount) {
    var type = typeof func;
    if (func == null || type == 'function') {
        return baseCreateCallback(func, thisArg, argCount);
    }
    if (type != 'object') {
        return property(func);
    }
    var props = keys(func), key = props[0], a = func[key];
    if (props.length == 1 && a === a && !isObject(a)) {
        return function (object) {
            var b = object[key];
            return a === b && (a !== 0 || 1 / a == 1 / b);
        };
    }
    return function (object) {
        var length = props.length, result = false;
        while (length--) {
            if (!(result = baseIsEqual(object[props[length]], func[props[length]], null, true))) {
                break;
            }
        }
        return result;
    };
}
module.exports = createCallback;
},{"../internals/baseCreateCallback":16,"../internals/baseIsEqual":20,"../objects/isObject":44,"../objects/keys":47,"../utilities/property":54}],12:[function(_dereq_,module,exports){
var arrayPool = [];
module.exports = arrayPool;
},{}],13:[function(_dereq_,module,exports){
var baseCreate = _dereq_('./baseCreate'), isObject = _dereq_('../objects/isObject'), setBindData = _dereq_('./setBindData'), slice = _dereq_('./slice');
var arrayRef = [];
var push = arrayRef.push;
function baseBind(bindData) {
    var func = bindData[0], partialArgs = bindData[2], thisArg = bindData[4];
    function bound() {
        if (partialArgs) {
            var args = slice(partialArgs);
            push.apply(args, arguments);
        }
        if (this instanceof bound) {
            var thisBinding = baseCreate(func.prototype), result = func.apply(thisBinding, args || arguments);
            return isObject(result) ? result : thisBinding;
        }
        return func.apply(thisArg, args || arguments);
    }
    setBindData(bound, bindData);
    return bound;
}
module.exports = baseBind;
},{"../objects/isObject":44,"./baseCreate":15,"./setBindData":31,"./slice":34}],14:[function(_dereq_,module,exports){
var assign = _dereq_('../objects/assign'), forEach = _dereq_('../collections/forEach'), forOwn = _dereq_('../objects/forOwn'), getArray = _dereq_('./getArray'), isArray = _dereq_('../objects/isArray'), isObject = _dereq_('../objects/isObject'), releaseArray = _dereq_('./releaseArray'), slice = _dereq_('./slice');
var reFlags = /\w*$/;
var argsClass = '[object Arguments]', arrayClass = '[object Array]', boolClass = '[object Boolean]', dateClass = '[object Date]', funcClass = '[object Function]', numberClass = '[object Number]', objectClass = '[object Object]', regexpClass = '[object RegExp]', stringClass = '[object String]';
var cloneableClasses = {};
cloneableClasses[funcClass] = false;
cloneableClasses[argsClass] = cloneableClasses[arrayClass] = cloneableClasses[boolClass] = cloneableClasses[dateClass] = cloneableClasses[numberClass] = cloneableClasses[objectClass] = cloneableClasses[regexpClass] = cloneableClasses[stringClass] = true;
var objectProto = Object.prototype;
var toString = objectProto.toString;
var hasOwnProperty = objectProto.hasOwnProperty;
var ctorByClass = {};
ctorByClass[arrayClass] = Array;
ctorByClass[boolClass] = Boolean;
ctorByClass[dateClass] = Date;
ctorByClass[funcClass] = Function;
ctorByClass[objectClass] = Object;
ctorByClass[numberClass] = Number;
ctorByClass[regexpClass] = RegExp;
ctorByClass[stringClass] = String;
function baseClone(value, isDeep, callback, stackA, stackB) {
    if (callback) {
        var result = callback(value);
        if (typeof result != 'undefined') {
            return result;
        }
    }
    var isObj = isObject(value);
    if (isObj) {
        var className = toString.call(value);
        if (!cloneableClasses[className]) {
            return value;
        }
        var ctor = ctorByClass[className];
        switch (className) {
        case boolClass:
        case dateClass:
            return new ctor(+value);
        case numberClass:
        case stringClass:
            return new ctor(value);
        case regexpClass:
            result = ctor(value.source, reFlags.exec(value));
            result.lastIndex = value.lastIndex;
            return result;
        }
    } else {
        return value;
    }
    var isArr = isArray(value);
    if (isDeep) {
        var initedStack = !stackA;
        stackA || (stackA = getArray());
        stackB || (stackB = getArray());
        var length = stackA.length;
        while (length--) {
            if (stackA[length] == value) {
                return stackB[length];
            }
        }
        result = isArr ? ctor(value.length) : {};
    } else {
        result = isArr ? slice(value) : assign({}, value);
    }
    if (isArr) {
        if (hasOwnProperty.call(value, 'index')) {
            result.index = value.index;
        }
        if (hasOwnProperty.call(value, 'input')) {
            result.input = value.input;
        }
    }
    if (!isDeep) {
        return result;
    }
    stackA.push(value);
    stackB.push(result);
    (isArr ? forEach : forOwn)(value, function (objValue, key) {
        result[key] = baseClone(objValue, isDeep, callback, stackA, stackB);
    });
    if (initedStack) {
        releaseArray(stackA);
        releaseArray(stackB);
    }
    return result;
}
module.exports = baseClone;
},{"../collections/forEach":7,"../objects/assign":35,"../objects/forOwn":40,"../objects/isArray":42,"../objects/isObject":44,"./getArray":24,"./releaseArray":30,"./slice":34}],15:[function(_dereq_,module,exports){
var isNative = _dereq_('./isNative'), isObject = _dereq_('../objects/isObject'), noop = _dereq_('../utilities/noop');
var nativeCreate = isNative(nativeCreate = Object.create) && nativeCreate;
function baseCreate(prototype, properties) {
    return isObject(prototype) ? nativeCreate(prototype) : {};
}
if (!nativeCreate) {
    baseCreate = function () {
        function Object() {
        }
        return function (prototype) {
            if (isObject(prototype)) {
                Object.prototype = prototype;
                var result = new Object();
                Object.prototype = null;
            }
            return result || window.Object();
        };
    }();
}
module.exports = baseCreate;
},{"../objects/isObject":44,"../utilities/noop":53,"./isNative":26}],16:[function(_dereq_,module,exports){
var bind = _dereq_('../functions/bind'), identity = _dereq_('../utilities/identity'), setBindData = _dereq_('./setBindData'), support = _dereq_('../support');
var reFuncName = /^\s*function[ \n\r\t]+\w/;
var reThis = /\bthis\b/;
var fnToString = Function.prototype.toString;
function baseCreateCallback(func, thisArg, argCount) {
    if (typeof func != 'function') {
        return identity;
    }
    if (typeof thisArg == 'undefined' || !('prototype' in func)) {
        return func;
    }
    var bindData = func.__bindData__;
    if (typeof bindData == 'undefined') {
        if (support.funcNames) {
            bindData = !func.name;
        }
        bindData = bindData || !support.funcDecomp;
        if (!bindData) {
            var source = fnToString.call(func);
            if (!support.funcNames) {
                bindData = !reFuncName.test(source);
            }
            if (!bindData) {
                bindData = reThis.test(source);
                setBindData(func, bindData);
            }
        }
    }
    if (bindData === false || bindData !== true && bindData[1] & 1) {
        return func;
    }
    switch (argCount) {
    case 1:
        return function (value) {
            return func.call(thisArg, value);
        };
    case 2:
        return function (a, b) {
            return func.call(thisArg, a, b);
        };
    case 3:
        return function (value, index, collection) {
            return func.call(thisArg, value, index, collection);
        };
    case 4:
        return function (accumulator, value, index, collection) {
            return func.call(thisArg, accumulator, value, index, collection);
        };
    }
    return bind(func, thisArg);
}
module.exports = baseCreateCallback;
},{"../functions/bind":10,"../support":50,"../utilities/identity":52,"./setBindData":31}],17:[function(_dereq_,module,exports){
var baseCreate = _dereq_('./baseCreate'), isObject = _dereq_('../objects/isObject'), setBindData = _dereq_('./setBindData'), slice = _dereq_('./slice');
var arrayRef = [];
var push = arrayRef.push;
function baseCreateWrapper(bindData) {
    var func = bindData[0], bitmask = bindData[1], partialArgs = bindData[2], partialRightArgs = bindData[3], thisArg = bindData[4], arity = bindData[5];
    var isBind = bitmask & 1, isBindKey = bitmask & 2, isCurry = bitmask & 4, isCurryBound = bitmask & 8, key = func;
    function bound() {
        var thisBinding = isBind ? thisArg : this;
        if (partialArgs) {
            var args = slice(partialArgs);
            push.apply(args, arguments);
        }
        if (partialRightArgs || isCurry) {
            args || (args = slice(arguments));
            if (partialRightArgs) {
                push.apply(args, partialRightArgs);
            }
            if (isCurry && args.length < arity) {
                bitmask |= 16 & ~32;
                return baseCreateWrapper([
                    func,
                    isCurryBound ? bitmask : bitmask & ~3,
                    args,
                    null,
                    thisArg,
                    arity
                ]);
            }
        }
        args || (args = arguments);
        if (isBindKey) {
            func = thisBinding[key];
        }
        if (this instanceof bound) {
            thisBinding = baseCreate(func.prototype);
            var result = func.apply(thisBinding, args);
            return isObject(result) ? result : thisBinding;
        }
        return func.apply(thisBinding, args);
    }
    setBindData(bound, bindData);
    return bound;
}
module.exports = baseCreateWrapper;
},{"../objects/isObject":44,"./baseCreate":15,"./setBindData":31,"./slice":34}],18:[function(_dereq_,module,exports){
var isArguments = _dereq_('../objects/isArguments'), isArray = _dereq_('../objects/isArray');
function baseFlatten(array, isShallow, isStrict, fromIndex) {
    var index = (fromIndex || 0) - 1, length = array ? array.length : 0, result = [];
    while (++index < length) {
        var value = array[index];
        if (value && typeof value == 'object' && typeof value.length == 'number' && (isArray(value) || isArguments(value))) {
            if (!isShallow) {
                value = baseFlatten(value, isShallow, isStrict);
            }
            var valIndex = -1, valLength = value.length, resIndex = result.length;
            result.length += valLength;
            while (++valIndex < valLength) {
                result[resIndex++] = value[valIndex];
            }
        } else if (!isStrict) {
            result.push(value);
        }
    }
    return result;
}
module.exports = baseFlatten;
},{"../objects/isArguments":41,"../objects/isArray":42}],19:[function(_dereq_,module,exports){
function baseIndexOf(array, value, fromIndex) {
    var index = (fromIndex || 0) - 1, length = array ? array.length : 0;
    while (++index < length) {
        if (array[index] === value) {
            return index;
        }
    }
    return -1;
}
module.exports = baseIndexOf;
},{}],20:[function(_dereq_,module,exports){
var forIn = _dereq_('../objects/forIn'), getArray = _dereq_('./getArray'), isFunction = _dereq_('../objects/isFunction'), objectTypes = _dereq_('./objectTypes'), releaseArray = _dereq_('./releaseArray');
var argsClass = '[object Arguments]', arrayClass = '[object Array]', boolClass = '[object Boolean]', dateClass = '[object Date]', numberClass = '[object Number]', objectClass = '[object Object]', regexpClass = '[object RegExp]', stringClass = '[object String]';
var objectProto = Object.prototype;
var toString = objectProto.toString;
var hasOwnProperty = objectProto.hasOwnProperty;
function baseIsEqual(a, b, callback, isWhere, stackA, stackB) {
    if (callback) {
        var result = callback(a, b);
        if (typeof result != 'undefined') {
            return !!result;
        }
    }
    if (a === b) {
        return a !== 0 || 1 / a == 1 / b;
    }
    var type = typeof a, otherType = typeof b;
    if (a === a && !(a && objectTypes[type]) && !(b && objectTypes[otherType])) {
        return false;
    }
    if (a == null || b == null) {
        return a === b;
    }
    var className = toString.call(a), otherClass = toString.call(b);
    if (className == argsClass) {
        className = objectClass;
    }
    if (otherClass == argsClass) {
        otherClass = objectClass;
    }
    if (className != otherClass) {
        return false;
    }
    switch (className) {
    case boolClass:
    case dateClass:
        return +a == +b;
    case numberClass:
        return a != +a ? b != +b : a == 0 ? 1 / a == 1 / b : a == +b;
    case regexpClass:
    case stringClass:
        return a == String(b);
    }
    var isArr = className == arrayClass;
    if (!isArr) {
        var aWrapped = hasOwnProperty.call(a, '__wrapped__'), bWrapped = hasOwnProperty.call(b, '__wrapped__');
        if (aWrapped || bWrapped) {
            return baseIsEqual(aWrapped ? a.__wrapped__ : a, bWrapped ? b.__wrapped__ : b, callback, isWhere, stackA, stackB);
        }
        if (className != objectClass) {
            return false;
        }
        var ctorA = a.constructor, ctorB = b.constructor;
        if (ctorA != ctorB && !(isFunction(ctorA) && ctorA instanceof ctorA && isFunction(ctorB) && ctorB instanceof ctorB) && ('constructor' in a && 'constructor' in b)) {
            return false;
        }
    }
    var initedStack = !stackA;
    stackA || (stackA = getArray());
    stackB || (stackB = getArray());
    var length = stackA.length;
    while (length--) {
        if (stackA[length] == a) {
            return stackB[length] == b;
        }
    }
    var size = 0;
    result = true;
    stackA.push(a);
    stackB.push(b);
    if (isArr) {
        length = a.length;
        size = b.length;
        result = size == length;
        if (result || isWhere) {
            while (size--) {
                var index = length, value = b[size];
                if (isWhere) {
                    while (index--) {
                        if (result = baseIsEqual(a[index], value, callback, isWhere, stackA, stackB)) {
                            break;
                        }
                    }
                } else if (!(result = baseIsEqual(a[size], value, callback, isWhere, stackA, stackB))) {
                    break;
                }
            }
        }
    } else {
        forIn(b, function (value, key, b) {
            if (hasOwnProperty.call(b, key)) {
                size++;
                return result = hasOwnProperty.call(a, key) && baseIsEqual(a[key], value, callback, isWhere, stackA, stackB);
            }
        });
        if (result && !isWhere) {
            forIn(a, function (value, key, a) {
                if (hasOwnProperty.call(a, key)) {
                    return result = --size > -1;
                }
            });
        }
    }
    stackA.pop();
    stackB.pop();
    if (initedStack) {
        releaseArray(stackA);
        releaseArray(stackB);
    }
    return result;
}
module.exports = baseIsEqual;
},{"../objects/forIn":39,"../objects/isFunction":43,"./getArray":24,"./objectTypes":28,"./releaseArray":30}],21:[function(_dereq_,module,exports){
var forEach = _dereq_('../collections/forEach'), forOwn = _dereq_('../objects/forOwn'), isArray = _dereq_('../objects/isArray'), isPlainObject = _dereq_('../objects/isPlainObject');
function baseMerge(object, source, callback, stackA, stackB) {
    (isArray(source) ? forEach : forOwn)(source, function (source, key) {
        var found, isArr, result = source, value = object[key];
        if (source && ((isArr = isArray(source)) || isPlainObject(source))) {
            var stackLength = stackA.length;
            while (stackLength--) {
                if (found = stackA[stackLength] == source) {
                    value = stackB[stackLength];
                    break;
                }
            }
            if (!found) {
                var isShallow;
                if (callback) {
                    result = callback(value, source);
                    if (isShallow = typeof result != 'undefined') {
                        value = result;
                    }
                }
                if (!isShallow) {
                    value = isArr ? isArray(value) ? value : [] : isPlainObject(value) ? value : {};
                }
                stackA.push(source);
                stackB.push(value);
                if (!isShallow) {
                    baseMerge(value, source, callback, stackA, stackB);
                }
            }
        } else {
            if (callback) {
                result = callback(value, source);
                if (typeof result == 'undefined') {
                    result = source;
                }
            }
            if (typeof result != 'undefined') {
                value = result;
            }
        }
        object[key] = value;
    });
}
module.exports = baseMerge;
},{"../collections/forEach":7,"../objects/forOwn":40,"../objects/isArray":42,"../objects/isPlainObject":45}],22:[function(_dereq_,module,exports){
var baseBind = _dereq_('./baseBind'), baseCreateWrapper = _dereq_('./baseCreateWrapper'), isFunction = _dereq_('../objects/isFunction'), slice = _dereq_('./slice');
var arrayRef = [];
var push = arrayRef.push, unshift = arrayRef.unshift;
function createWrapper(func, bitmask, partialArgs, partialRightArgs, thisArg, arity) {
    var isBind = bitmask & 1, isBindKey = bitmask & 2, isCurry = bitmask & 4, isCurryBound = bitmask & 8, isPartial = bitmask & 16, isPartialRight = bitmask & 32;
    if (!isBindKey && !isFunction(func)) {
        // throw new TypeError();
        console.warn( new Error() );
        console.trace();
    }
    if (isPartial && !partialArgs.length) {
        bitmask &= ~16;
        isPartial = partialArgs = false;
    }
    if (isPartialRight && !partialRightArgs.length) {
        bitmask &= ~32;
        isPartialRight = partialRightArgs = false;
    }
    var bindData = func && func.__bindData__;
    if (bindData && bindData !== true) {
        bindData = slice(bindData);
        if (bindData[2]) {
            bindData[2] = slice(bindData[2]);
        }
        if (bindData[3]) {
            bindData[3] = slice(bindData[3]);
        }
        if (isBind && !(bindData[1] & 1)) {
            bindData[4] = thisArg;
        }
        if (!isBind && bindData[1] & 1) {
            bitmask |= 8;
        }
        if (isCurry && !(bindData[1] & 4)) {
            bindData[5] = arity;
        }
        if (isPartial) {
            push.apply(bindData[2] || (bindData[2] = []), partialArgs);
        }
        if (isPartialRight) {
            unshift.apply(bindData[3] || (bindData[3] = []), partialRightArgs);
        }
        bindData[1] |= bitmask;
        return createWrapper.apply(null, bindData);
    }
    var creater = bitmask == 1 || bitmask === 17 ? baseBind : baseCreateWrapper;
    return creater([
        func,
        bitmask,
        partialArgs,
        partialRightArgs,
        thisArg,
        arity
    ]);
}
module.exports = createWrapper;
},{"../objects/isFunction":43,"./baseBind":13,"./baseCreateWrapper":17,"./slice":34}],23:[function(_dereq_,module,exports){
var htmlEscapes = _dereq_('./htmlEscapes');
function escapeHtmlChar(match) {
    return htmlEscapes[match];
}
module.exports = escapeHtmlChar;
},{"./htmlEscapes":25}],24:[function(_dereq_,module,exports){
var arrayPool = _dereq_('./arrayPool');
function getArray() {
    return arrayPool.pop() || [];
}
module.exports = getArray;
},{"./arrayPool":12}],25:[function(_dereq_,module,exports){
var htmlEscapes = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        '\'': '&#39;'
    };
module.exports = htmlEscapes;
},{}],26:[function(_dereq_,module,exports){
var objectProto = Object.prototype;
var toString = objectProto.toString;
var reNative = RegExp('^' + String(toString).replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/toString| for [^\]]+/g, '.*?') + '$');
function isNative(value) {
    return typeof value == 'function' && reNative.test(value);
}
module.exports = isNative;
},{}],27:[function(_dereq_,module,exports){
var maxPoolSize = 40;
module.exports = maxPoolSize;
},{}],28:[function(_dereq_,module,exports){
var objectTypes = {
        'boolean': false,
        'function': true,
        'object': true,
        'number': false,
        'string': false,
        'undefined': false
    };
module.exports = objectTypes;
},{}],29:[function(_dereq_,module,exports){
var htmlEscapes = _dereq_('./htmlEscapes'), keys = _dereq_('../objects/keys');
var reUnescapedHtml = RegExp('[' + keys(htmlEscapes).join('') + ']', 'g');
module.exports = reUnescapedHtml;
},{"../objects/keys":47,"./htmlEscapes":25}],30:[function(_dereq_,module,exports){
var arrayPool = _dereq_('./arrayPool'), maxPoolSize = _dereq_('./maxPoolSize');
function releaseArray(array) {
    array.length = 0;
    if (arrayPool.length < maxPoolSize) {
        arrayPool.push(array);
    }
}
module.exports = releaseArray;
},{"./arrayPool":12,"./maxPoolSize":27}],31:[function(_dereq_,module,exports){
var isNative = _dereq_('./isNative'), noop = _dereq_('../utilities/noop');
var descriptor = {
        'configurable': false,
        'enumerable': false,
        'value': null,
        'writable': false
    };
var defineProperty = function () {
        try {
            var o = {}, func = isNative(func = Object.defineProperty) && func, result = func(o, o, o) && func;
        } catch (e) {
        }
        return result;
    }();
var setBindData = !defineProperty ? noop : function (func, value) {
        descriptor.value = value;
        defineProperty(func, '__bindData__', descriptor);
    };
module.exports = setBindData;
},{"../utilities/noop":53,"./isNative":26}],32:[function(_dereq_,module,exports){
var forIn = _dereq_('../objects/forIn'), isFunction = _dereq_('../objects/isFunction');
var objectClass = '[object Object]';
var objectProto = Object.prototype;
var toString = objectProto.toString;
var hasOwnProperty = objectProto.hasOwnProperty;
function shimIsPlainObject(value) {
    var ctor, result;
    if (!(value && toString.call(value) == objectClass) || (ctor = value.constructor, isFunction(ctor) && !(ctor instanceof ctor))) {
        return false;
    }
    forIn(value, function (value, key) {
        result = key;
    });
    return typeof result == 'undefined' || hasOwnProperty.call(value, result);
}
module.exports = shimIsPlainObject;
},{"../objects/forIn":39,"../objects/isFunction":43}],33:[function(_dereq_,module,exports){
var objectTypes = _dereq_('./objectTypes');
var objectProto = Object.prototype;
var hasOwnProperty = objectProto.hasOwnProperty;
var shimKeys = function (object) {
    var index, iterable = object, result = [];
    if (!iterable)
        return result;
    if (!objectTypes[typeof object])
        return result;
    for (index in iterable) {
        if (hasOwnProperty.call(iterable, index)) {
            result.push(index);
        }
    }
    return result;
};
module.exports = shimKeys;
},{"./objectTypes":28}],34:[function(_dereq_,module,exports){
function slice(array, start, end) {
    start || (start = 0);
    if (typeof end == 'undefined') {
        end = array ? array.length : 0;
    }
    var index = -1, length = end - start || 0, result = Array(length < 0 ? 0 : length);
    while (++index < length) {
        result[index] = array[start + index];
    }
    return result;
}
module.exports = slice;
},{}],35:[function(_dereq_,module,exports){
var baseCreateCallback = _dereq_('../internals/baseCreateCallback'), keys = _dereq_('./keys'), objectTypes = _dereq_('../internals/objectTypes');
var assign = function (object, source, guard) {
    var index, iterable = object, result = iterable;
    if (!iterable)
        return result;
    var args = arguments, argsIndex = 0, argsLength = typeof guard == 'number' ? 2 : args.length;
    if (argsLength > 3 && typeof args[argsLength - 2] == 'function') {
        var callback = baseCreateCallback(args[--argsLength - 1], args[argsLength--], 2);
    } else if (argsLength > 2 && typeof args[argsLength - 1] == 'function') {
        callback = args[--argsLength];
    }
    while (++argsIndex < argsLength) {
        iterable = args[argsIndex];
        if (iterable && objectTypes[typeof iterable]) {
            var ownIndex = -1, ownProps = objectTypes[typeof iterable] && keys(iterable), length = ownProps ? ownProps.length : 0;
            while (++ownIndex < length) {
                index = ownProps[ownIndex];
                result[index] = callback ? callback(result[index], iterable[index]) : iterable[index];
            }
        }
    }
    return result;
};
module.exports = assign;
},{"../internals/baseCreateCallback":16,"../internals/objectTypes":28,"./keys":47}],36:[function(_dereq_,module,exports){
var baseClone = _dereq_('../internals/baseClone'), baseCreateCallback = _dereq_('../internals/baseCreateCallback');
function cloneDeep(value, callback, thisArg) {
    return baseClone(value, true, typeof callback == 'function' && baseCreateCallback(callback, thisArg, 1));
}
module.exports = cloneDeep;
},{"../internals/baseClone":14,"../internals/baseCreateCallback":16}],37:[function(_dereq_,module,exports){
var keys = _dereq_('./keys'), objectTypes = _dereq_('../internals/objectTypes');
var defaults = function (object, source, guard) {
    var index, iterable = object, result = iterable;
    if (!iterable)
        return result;
    var args = arguments, argsIndex = 0, argsLength = typeof guard == 'number' ? 2 : args.length;
    while (++argsIndex < argsLength) {
        iterable = args[argsIndex];
        if (iterable && objectTypes[typeof iterable]) {
            var ownIndex = -1, ownProps = objectTypes[typeof iterable] && keys(iterable), length = ownProps ? ownProps.length : 0;
            while (++ownIndex < length) {
                index = ownProps[ownIndex];
                if (typeof result[index] == 'undefined')
                    result[index] = iterable[index];
            }
        }
    }
    return result;
};
module.exports = defaults;
},{"../internals/objectTypes":28,"./keys":47}],38:[function(_dereq_,module,exports){
var createCallback = _dereq_('../functions/createCallback'), forOwn = _dereq_('./forOwn');
function findKey(object, callback, thisArg) {
    var result;
    callback = createCallback(callback, thisArg, 3);
    forOwn(object, function (value, key, object) {
        if (callback(value, key, object)) {
            result = key;
            return false;
        }
    });
    return result;
}
module.exports = findKey;
},{"../functions/createCallback":11,"./forOwn":40}],39:[function(_dereq_,module,exports){
var baseCreateCallback = _dereq_('../internals/baseCreateCallback'), objectTypes = _dereq_('../internals/objectTypes');
var forIn = function (collection, callback, thisArg) {
    var index, iterable = collection, result = iterable;
    if (!iterable)
        return result;
    if (!objectTypes[typeof iterable])
        return result;
    callback = callback && typeof thisArg == 'undefined' ? callback : baseCreateCallback(callback, thisArg, 3);
    for (index in iterable) {
        if (callback(iterable[index], index, collection) === false)
            return result;
    }
    return result;
};
module.exports = forIn;
},{"../internals/baseCreateCallback":16,"../internals/objectTypes":28}],40:[function(_dereq_,module,exports){
var baseCreateCallback = _dereq_('../internals/baseCreateCallback'), keys = _dereq_('./keys'), objectTypes = _dereq_('../internals/objectTypes');
var forOwn = function (collection, callback, thisArg) {
    var index, iterable = collection, result = iterable;
    if (!iterable)
        return result;
    if (!objectTypes[typeof iterable])
        return result;
    callback = callback && typeof thisArg == 'undefined' ? callback : baseCreateCallback(callback, thisArg, 3);
    var ownIndex = -1, ownProps = objectTypes[typeof iterable] && keys(iterable), length = ownProps ? ownProps.length : 0;
    while (++ownIndex < length) {
        index = ownProps[ownIndex];
        if (callback(iterable[index], index, collection) === false)
            return result;
    }
    return result;
};
module.exports = forOwn;
},{"../internals/baseCreateCallback":16,"../internals/objectTypes":28,"./keys":47}],41:[function(_dereq_,module,exports){
var argsClass = '[object Arguments]';
var objectProto = Object.prototype;
var toString = objectProto.toString;
function isArguments(value) {
    return value && typeof value == 'object' && typeof value.length == 'number' && toString.call(value) == argsClass || false;
}
module.exports = isArguments;
},{}],42:[function(_dereq_,module,exports){
var isNative = _dereq_('../internals/isNative');
var arrayClass = '[object Array]';
var objectProto = Object.prototype;
var toString = objectProto.toString;
var nativeIsArray = isNative(nativeIsArray = Array.isArray) && nativeIsArray;
var isArray = nativeIsArray || function (value) {
        return value && typeof value == 'object' && typeof value.length == 'number' && toString.call(value) == arrayClass || false;
    };
module.exports = isArray;
},{"../internals/isNative":26}],43:[function(_dereq_,module,exports){
function isFunction(value) {
    return typeof value == 'function';
}
module.exports = isFunction;
},{}],44:[function(_dereq_,module,exports){
var objectTypes = _dereq_('../internals/objectTypes');
function isObject(value) {
    return !!(value && objectTypes[typeof value]);
}
module.exports = isObject;
},{"../internals/objectTypes":28}],45:[function(_dereq_,module,exports){
var isNative = _dereq_('../internals/isNative'), shimIsPlainObject = _dereq_('../internals/shimIsPlainObject');
var objectClass = '[object Object]';
var objectProto = Object.prototype;
var toString = objectProto.toString;
var getPrototypeOf = isNative(getPrototypeOf = Object.getPrototypeOf) && getPrototypeOf;
var isPlainObject = !getPrototypeOf ? shimIsPlainObject : function (value) {
        if (!(value && toString.call(value) == objectClass)) {
            return false;
        }
        var valueOf = value.valueOf, objProto = isNative(valueOf) && (objProto = getPrototypeOf(valueOf)) && getPrototypeOf(objProto);
        return objProto ? value == objProto || getPrototypeOf(value) == objProto : shimIsPlainObject(value);
    };
module.exports = isPlainObject;
},{"../internals/isNative":26,"../internals/shimIsPlainObject":32}],46:[function(_dereq_,module,exports){
var stringClass = '[object String]';
var objectProto = Object.prototype;
var toString = objectProto.toString;
function isString(value) {
    return typeof value == 'string' || value && typeof value == 'object' && toString.call(value) == stringClass || false;
}
module.exports = isString;
},{}],47:[function(_dereq_,module,exports){
var isNative = _dereq_('../internals/isNative'), isObject = _dereq_('./isObject'), shimKeys = _dereq_('../internals/shimKeys');
var nativeKeys = isNative(nativeKeys = Object.keys) && nativeKeys;
var keys = !nativeKeys ? shimKeys : function (object) {
        if (!isObject(object)) {
            return [];
        }
        return nativeKeys(object);
    };
module.exports = keys;
},{"../internals/isNative":26,"../internals/shimKeys":33,"./isObject":44}],48:[function(_dereq_,module,exports){
var baseCreateCallback = _dereq_('../internals/baseCreateCallback'), baseMerge = _dereq_('../internals/baseMerge'), getArray = _dereq_('../internals/getArray'), isObject = _dereq_('./isObject'), releaseArray = _dereq_('../internals/releaseArray'), slice = _dereq_('../internals/slice');
function merge(object) {
    var args = arguments, length = 2;
    if (!isObject(object)) {
        return object;
    }
    if (typeof args[2] != 'number') {
        length = args.length;
    }
    if (length > 3 && typeof args[length - 2] == 'function') {
        var callback = baseCreateCallback(args[--length - 1], args[length--], 2);
    } else if (length > 2 && typeof args[length - 1] == 'function') {
        callback = args[--length];
    }
    var sources = slice(arguments, 1, length), index = -1, stackA = getArray(), stackB = getArray();
    while (++index < length) {
        baseMerge(object, sources[index], callback, stackA, stackB);
    }
    releaseArray(stackA);
    releaseArray(stackB);
    return object;
}
module.exports = merge;
},{"../internals/baseCreateCallback":16,"../internals/baseMerge":21,"../internals/getArray":24,"../internals/releaseArray":30,"../internals/slice":34,"./isObject":44}],49:[function(_dereq_,module,exports){
var keys = _dereq_('./keys');
function values(object) {
    var index = -1, props = keys(object), length = props.length, result = Array(length);
    while (++index < length) {
        result[index] = object[props[index]];
    }
    return result;
}
module.exports = values;
},{"./keys":47}],50:[function(_dereq_,module,exports){
var isNative = _dereq_('./internals/isNative');
var reThis = /\bthis\b/;
var support = {};
support.funcDecomp = !isNative(window.WinRTError) && reThis.test(function () {
    return this;
});
support.funcNames = typeof Function.name == 'string';
module.exports = support;
},{"./internals/isNative":26}],51:[function(_dereq_,module,exports){
var escapeHtmlChar = _dereq_('../internals/escapeHtmlChar'), keys = _dereq_('../objects/keys'), reUnescapedHtml = _dereq_('../internals/reUnescapedHtml');
function escape(string) {
    return string == null ? '' : String(string).replace(reUnescapedHtml, escapeHtmlChar);
}
module.exports = escape;
},{"../internals/escapeHtmlChar":23,"../internals/reUnescapedHtml":29,"../objects/keys":47}],52:[function(_dereq_,module,exports){
function identity(value) {
    return value;
}
module.exports = identity;
},{}],53:[function(_dereq_,module,exports){
function noop() {
}
module.exports = noop;
},{}],54:[function(_dereq_,module,exports){
function property(key) {
    return function (object) {
        return object[key];
    };
}
module.exports = property;
},{}],55:[function(_dereq_,module,exports){
var contains = _dereq_('lodash-amd/modern/collections/contains');
'use strict';
var blockElementNames = [
        'P',
        'LI',
        'DIV',
        'BLOCKQUOTE',
        'UL',
        'OL',
        'H1',
        'H2',
        'H3',
        'H4',
        'H5',
        'H6'
    ];
function isBlockElement(node) {
    return contains(blockElementNames, node.nodeName);
}
function isSelectionMarkerNode(node) {
    return node.nodeType === Node.ELEMENT_NODE && node.className === 'scribe-marker';
}
function unwrap(node, childNode) {
    while (childNode.childNodes.length > 0) {
        node.insertBefore(childNode.childNodes[0], childNode);
    }
    node.removeChild(childNode);
}
module.exports = {
    isBlockElement: isBlockElement,
    isSelectionMarkerNode: isSelectionMarkerNode,
    unwrap: unwrap
};
},{"lodash-amd/modern/collections/contains":6}],56:[function(_dereq_,module,exports){
'use strict';
function isEmptyTextNode(node) {
    return node.nodeType === Node.TEXT_NODE && node.textContent === '';
}
function insertAfter(newNode, referenceNode) {
    return referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}
function removeNode(node) {
    return node.parentNode.removeChild(node);
}
module.exports = {
    isEmptyTextNode: isEmptyTextNode,
    insertAfter: insertAfter,
    removeNode: removeNode
};
},{}],57:[function(_dereq_,module,exports){
module.exports=_dereq_(55)
},{"lodash-amd/modern/collections/contains":6}],58:[function(_dereq_,module,exports){
'use strict';
module.exports = function () {
    return function (scribe) {
        var blockquoteCommand = new scribe.api.SimpleCommand('blockquote', 'BLOCKQUOTE');
        blockquoteCommand.execute = function () {
            var command = scribe.getCommand(this.queryState() ? 'outdent' : 'indent');
            command.execute();
        };
        blockquoteCommand.queryEnabled = function () {
            var command = scribe.getCommand(this.queryState() ? 'outdent' : 'indent');
            return command.queryEnabled();
        };
        blockquoteCommand.queryState = function () {
            var selection = new scribe.api.Selection();
            var blockquoteElement = selection.getContaining(function (element) {
                    return element.nodeName === 'BLOCKQUOTE';
                });
            return scribe.allowsBlockElements() && !!blockquoteElement;
        };
        scribe.commands.blockquote = blockquoteCommand;
        if (scribe.allowsBlockElements()) {
            scribe.el.addEventListener('keydown', function (event) {
                if (event.keyCode === 13) {
                    var command = scribe.getCommand('blockquote');
                    if (command.queryState()) {
                        var selection = new scribe.api.Selection();
                        if (selection.isCaretOnNewLine()) {
                            event.preventDefault();
                            command.execute();
                        }
                    }
                }
            });
        }
    };
};
},{}],59:[function(_dereq_,module,exports){
'use strict';
module.exports = function () {
    return function (scribe) {
        var codeCommand = new scribe.api.SimpleCommand('code', 'CODE');
        codeCommand.execute = function () {
            scribe.transactionManager.run(function () {
                var selection = new scribe.api.Selection();
                var range = selection.range;
                var selectedHtmlDocumentFragment = range.extractContents();
                var codeElement = document.createElement('code');
                codeElement.appendChild(selectedHtmlDocumentFragment);
                range.insertNode(codeElement);
                range.selectNode(codeElement);
                selection.selection.removeAllRanges();
                selection.selection.addRange(range);
            });
        };
        codeCommand.queryState = function () {
            var selection = new scribe.api.Selection();
            return !!selection.getContaining(function (node) {
                return node.nodeName === this.nodeName;
            }.bind(this));
        };
        codeCommand.queryEnabled = function () {
            var selection = new scribe.api.Selection();
            var range = selection.range;
            return !range.collapsed;
        };
        scribe.commands.code = codeCommand;
    };
};
},{}],60:[function(_dereq_,module,exports){
'use strict';
module.exports = function () {
    var keys = {
            34: '"',
            39: '\''
        };
    var openDoubleCurly = '\u201c';
    var closeDoubleCurly = '\u201d';
    var openSingleCurly = '\u2018';
    var closeSingleCurly = '\u2019';
    var NON_BREAKING_SPACE = '\xa0';
    return function (scribe) {
        scribe.el.addEventListener('keypress', input);
        scribe.registerHTMLFormatter('normalize', substituteCurlyQuotes);
        function input(event) {
            var curlyChar;
            var currentChar = keys[event.charCode];
            if (currentChar === '"') {
                if (wordBeforeSelectedRange()) {
                    curlyChar = closeDoubleCurly;
                } else {
                    curlyChar = openDoubleCurly;
                }
            } else if (currentChar === '\'') {
                if (wordBeforeSelectedRange()) {
                    curlyChar = closeSingleCurly;
                } else {
                    curlyChar = openSingleCurly;
                }
            }
            if (curlyChar) {
                event.preventDefault();
                scribe.transactionManager.run(function () {
                    var quoteText = replaceSelectedRangeWith(curlyChar);
                    placeCaretAfter(quoteText);
                });
            }
        }
        function wordBeforeSelectedRange() {
            var prevChar = charBeforeSelectedRange() || '';
            return isWordCharacter(prevChar);
        }
        function charBeforeSelectedRange() {
            var selection = new scribe.api.Selection();
            var context = selection.range.commonAncestorContainer.textContent;
            return context[selection.range.startOffset - 1];
        }
        function charAfterSelectedRange() {
            var selection = new scribe.api.Selection();
            var context = selection.range.commonAncestorContainer.textContent;
            return context[selection.range.endOffset];
        }
        function isWordCharacter(character) {
            return /[^\s()]/.test(character);
        }
        function replaceSelectedRangeWith(text) {
            var textNode = document.createTextNode(text);
            var selection = new scribe.api.Selection();
            selection.range.deleteContents();
            selection.range.insertNode(textNode);
            return textNode;
        }
        function placeCaretAfter(node) {
            var rangeAfter = document.createRange();
            rangeAfter.setStartAfter(node);
            rangeAfter.setEndAfter(node);
            var selection = new scribe.api.Selection();
            selection.selection.removeAllRanges();
            selection.selection.addRange(rangeAfter);
        }
        function substituteCurlyQuotes(html) {
            var holder = document.createElement('div');
            holder.innerHTML = html;
            mapTextNodes(holder, function (str) {
                var tokens = str.split(/(<[^>]+?>)/);
                return tokens.map(function (token) {
                    if (token[0] === '<') {
                        return token;
                    } else {
                        return token.replace(/([\s\S])?'([\s\S])?/g, replaceQuotesFromContext(openSingleCurly, closeSingleCurly)).replace(/([\s\S])?"([\s\S])?/g, replaceQuotesFromContext(openDoubleCurly, closeDoubleCurly));
                    }
                }).join('');
            });
            return holder.innerHTML;
        }
        function replaceQuotesFromContext(openCurly, closeCurly) {
            return function (m, prev, next) {
                prev = prev || '';
                next = next || '';
                var isStart = !prev;
                var isEnd = !next;
                var hasCharsBefore = isWordCharacter(prev);
                var hasCharsAfter = isWordCharacter(next);
                if (hasCharsBefore || isStart && !hasCharsAfter && !isEnd) {
                    return prev + closeCurly + next;
                } else {
                    return prev + openCurly + next;
                }
            };
        }
        function mapTextNodes(container, func) {
            var walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
            var node = walker.firstChild();
            if (node) {
                do {
                    node.data = func(node.data);
                } while (node = walker.nextSibling());
            }
            return node;
        }
    };
};
},{}],61:[function(_dereq_,module,exports){
'use strict';
module.exports = function () {
    return function (scribe) {
        scribe.registerPlainTextFormatter(function (html) {
            return html.replace(/\n([ \t]*\n)+/g, '</p><p>').replace(/\n/g, '<br>');
        });
    };
};
},{}],62:[function(_dereq_,module,exports){
'use strict';
module.exports = function (level) {
    return function (scribe) {
        var tag = '<h' + level + '>';
        var nodeName = 'H' + level;
        var commandName = 'h' + level;
        var headingCommand = new scribe.api.Command('formatBlock');
        headingCommand.execute = function () {
            if (this.queryState()) {
                scribe.api.Command.prototype.execute.call(this, '<p>');
            } else {
                scribe.api.Command.prototype.execute.call(this, tag);
            }
        };
        headingCommand.queryState = function () {
            var selection = new scribe.api.Selection();
            return !!selection.getContaining(function (node) {
                return node.nodeName === nodeName;
            });
        };
        headingCommand.queryEnabled = function () {
            var selection = new scribe.api.Selection();
            var listNode = selection.getContaining(function (node) {
                    return node.nodeName === 'OL' || node.nodeName === 'UL';
                });
            return scribe.api.Command.prototype.queryEnabled.apply(this, arguments) && scribe.allowsBlockElements() && !listNode;
        };
        scribe.commands[commandName] = headingCommand;
    };
};
},{}],63:[function(_dereq_,module,exports){
var element = _dereq_('scribe-common/src/element');
'use strict';
module.exports = function () {
    return function (scribe) {
        var unlinkCommand = new scribe.api.Command('unlink');
        unlinkCommand.execute = function () {
            var selection = new scribe.api.Selection();
            if (selection.selection.isCollapsed) {
                scribe.transactionManager.run(function () {
                    var aNode = selection.getContaining(function (node) {
                            return node.nodeName === 'A';
                        });
                    if (aNode) {
                        selection.placeMarkers();
                        element.unwrap(aNode.parentNode, aNode);
                        selection.selectMarkers();
                    }
                });
            } else {
                scribe.api.Command.prototype.execute.apply(this, arguments);
            }
        };
        unlinkCommand.queryEnabled = function () {
            var selection = new scribe.api.Selection();
            if (selection.selection.isCollapsed) {
                return !!selection.getContaining(function (node) {
                    return node.nodeName === 'A';
                });
            } else {
                return scribe.api.Command.prototype.queryEnabled.apply(this, arguments);
            }
        };
        scribe.commands.unlink = unlinkCommand;
    };
};
},{"scribe-common/src/element":57}],64:[function(_dereq_,module,exports){
var findKey = _dereq_('lodash-amd/modern/objects/findKey');
'use strict';
module.exports = function (commandsToKeyboardShortcutsMap) {
    return function (scribe) {
        scribe.el.addEventListener('keydown', function (event) {
            var commandName = findKey(commandsToKeyboardShortcutsMap, function (isKeyboardShortcut) {
                    return isKeyboardShortcut(event);
                });
            if (commandName) {
                var command = scribe.getCommand(commandName);
                event.preventDefault();
                if (command.queryEnabled()) {
                    command.execute();
                }
            }
        });
    };
};
},{"lodash-amd/modern/objects/findKey":38}],65:[function(_dereq_,module,exports){
'use strict';
module.exports = function () {
    return function (scribe) {
        var linkPromptCommand = new scribe.api.Command('createLink');
        linkPromptCommand.nodeName = 'A';
        linkPromptCommand.execute = function () {
            var selection = new scribe.api.Selection();
            var range = selection.range;
            var anchorNode = selection.getContaining(function (node) {
                    return node.nodeName === this.nodeName;
                }.bind(this));
            var initialLink = anchorNode ? anchorNode.href : 'http://';
            var link = window.prompt('Enter a link.', initialLink);
            if (anchorNode) {
                range.selectNode(anchorNode);
                selection.selection.removeAllRanges();
                selection.selection.addRange(range);
            }
            if (link) {
                var urlProtocolRegExp = /^https?\:\/\//;
                if (!urlProtocolRegExp.test(link)) {
                    if (!/^mailto\:/.test(link) && /@/.test(link)) {
                        var shouldPrefixEmail = window.confirm('The URL you entered appears to be an email address. ' + 'Do you want to add the required \u201cmailto:\u201d prefix?');
                        if (shouldPrefixEmail) {
                            link = 'mailto:' + link;
                        }
                    } else {
                        var shouldPrefixLink = window.confirm('The URL you entered appears to be a link. ' + 'Do you want to add the required \u201chttp://\u201d prefix?');
                        if (shouldPrefixLink) {
                            link = 'http://' + link;
                        }
                    }
                }
                scribe.api.SimpleCommand.prototype.execute.call(this, link);
            }
        };
        linkPromptCommand.queryState = function () {
            var selection = new scribe.api.Selection();
            return !!selection.getContaining(function (node) {
                return node.nodeName === this.nodeName;
            }.bind(this));
        };
        scribe.commands.linkPrompt = linkPromptCommand;
    };
};
},{}],66:[function(_dereq_,module,exports){
// UMD
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else {
    root.amdWeb = factory();
  }
}(this, function () {

  function HTMLJanitor(config) {
    this.config = config;
  }

  HTMLJanitor.prototype.clean = function (html) {
    var sandbox = document.createElement('div');
    sandbox.innerHTML = html;

    this._sanitize(sandbox);

    return sandbox.innerHTML;
  };

  HTMLJanitor.prototype._sanitize = function (parentNode) {
    var treeWalker = createTreeWalker(parentNode);
    var node = treeWalker.firstChild();
    if (!node) { return; }

    do {
      var nodeName = node.nodeName.toLowerCase();
      var allowedAttrs = this.config.tags[nodeName];

      // Ignore text nodes and nodes that have already been sanitized
      if (node.nodeType === 3 || node._sanitized) {
        continue;
      }

      var isInlineElement = nodeName === 'b';
      var containsBlockElement;
      if (isInlineElement) {
        containsBlockElement = Array.prototype.some.call(node.childNodes, function (childNode) {
          // TODO: test other block elements
          return childNode.nodeName === 'P';
        });
      }

      var isInvalid = isInlineElement && containsBlockElement;

      // Drop tag entirely according to the whitelist *and* if the markup
      // is invalid.
      if (!this.config.tags[nodeName] || isInvalid) {
        // Do not keep the inner text of SCRIPT/STYLE elements.
        if (! (node.nodeName === 'SCRIPT' || node.nodeName === 'STYLE')) {
          while (node.childNodes.length > 0) {
            parentNode.insertBefore(node.childNodes[0], node);
          }
        }
        parentNode.removeChild(node);

        this._sanitize(parentNode);
        break;
      }

      // Sanitize attributes
      for (var a = 0; a < node.attributes.length; a += 1) {
        var attr = node.attributes[a];
        var attrName = attr.name.toLowerCase();

        // Allow attribute?
        var allowedAttrValue = allowedAttrs[attrName];
        var notInAttrList = ! allowedAttrValue;
        var valueNotAllowed = allowedAttrValue !== true && attr.value !== allowedAttrValue;
        if (notInAttrList || valueNotAllowed) {
          node.removeAttribute(attr.name);
          // Shift the array to continue looping.
          a = a - 1;
        }
      }

      // Sanitize children
      this._sanitize(node);

      // Mark node as sanitized so it's ignored in future runs
      node._sanitized = true;
    } while (node = treeWalker.nextSibling());
  };

  function createTreeWalker(node) {
    return document.createTreeWalker(node, NodeFilter.SHOW_ELEMENT);
  }

  return HTMLJanitor;

}));

},{}],67:[function(_dereq_,module,exports){
var HTMLJanitor = _dereq_('html-janitor'), merge = _dereq_('lodash-amd/modern/objects/merge'), cloneDeep = _dereq_('lodash-amd/modern/objects/cloneDeep');
'use strict';
module.exports = function (config) {
    var configAllowMarkers = merge(cloneDeep(config), { tags: { em: { class: 'scribe-marker' } } });
    return function (scribe) {
        var janitor = new HTMLJanitor(configAllowMarkers);
        scribe.registerHTMLFormatter('sanitize', janitor.clean.bind(janitor));
    };
};
},{"html-janitor":66,"lodash-amd/modern/objects/cloneDeep":36,"lodash-amd/modern/objects/merge":48}],68:[function(_dereq_,module,exports){
var element = _dereq_('scribe-common/element');
'use strict';
module.exports = function () {
    var keys = {
            32: 'Space',
            42: '*',
            45: '-',
            46: '.',
            49: '1',
            8226: '\u2022'
        };
    function isUnorderedListChar(string) {
        return string === '*' || string === '-' || string === '\u2022';
    }
    function findBlockContainer(node) {
        while (node && !element.isBlockElement(node)) {
            node = node.parentNode;
        }
        return node;
    }
    return function (scribe) {
        var preLastChar, lastChar, currentChar;
        function removeSelectedTextNode() {
            var selection = new scribe.api.Selection();
            var container = selection.range.commonAncestorContainer;
            if (container.nodeType === Node.TEXT_NODE) {
                container.parentNode.removeChild(container);
            } else {
                console.warn( new Error('Cannot empty non-text node!') );
                console.trace();
                // throw new Error('Cannot empty non-text node!');
            }
        }
        function input(event) {
            var listCommand;
            preLastChar = lastChar;
            lastChar = currentChar;
            currentChar = keys[event.charCode];
            var selection = new scribe.api.Selection();
            var container = selection.range.commonAncestorContainer;
            var blockContainer = findBlockContainer(container);
            if (blockContainer && blockContainer.tagName === 'P') {
                var startOfLineIsUList = isUnorderedListChar(container.textContent[0]);
                if (isUnorderedListChar(lastChar) && currentChar === 'Space' && startOfLineIsUList) {
                    listCommand = 'insertUnorderedList';
                }
                var startOfLineIsOList = container.textContent === '1.';
                if (preLastChar === '1' && lastChar === '.' && currentChar === 'Space' && startOfLineIsOList) {
                    listCommand = 'insertOrderedList';
                }
            }
            if (listCommand) {
                event.preventDefault();
                scribe.transactionManager.run(function () {
                    scribe.getCommand(listCommand).execute();
                    removeSelectedTextNode();
                });
            }
        }
        scribe.el.addEventListener('keypress', input);
    };
};
},{"scribe-common/element":55}],69:[function(_dereq_,module,exports){
'use strict';
module.exports = function (toolbarNode) {
    return function (scribe) {
        var buttons = toolbarNode.querySelectorAll('button[data-command-name]');
        Array.prototype.forEach.call(buttons, function (button) {
            button.addEventListener('click', function () {
                var command = scribe.getCommand(button.dataset.commandName);
                scribe.el.focus();
                command.execute();
            });
            scribe.el.addEventListener('keyup', updateUi);
            scribe.el.addEventListener('mouseup', updateUi);
            scribe.el.addEventListener('focus', updateUi);
            scribe.el.addEventListener('blur', updateUi);
            scribe.on('content-changed', updateUi);
            function updateUi() {
                var command = scribe.getCommand(button.dataset.commandName);
                var selection = new scribe.api.Selection();
                if (selection.range && command.queryState()) {
                    button.classList.add('active');
                } else {
                    button.classList.remove('active');
                }
                if (selection.range && command.queryEnabled()) {
                    button.removeAttribute('disabled');
                } else {
                    button.setAttribute('disabled', 'disabled');
                }
            }
        });
    };
};
},{}],70:[function(_dereq_,module,exports){
var buildCommandPatch = _dereq_('./api/command-patch'), buildCommand = _dereq_('./api/command'), Node = _dereq_('./api/node'), buildSelection = _dereq_('./api/selection'), buildSimpleCommand = _dereq_('./api/simple-command');
'use strict';
module.exports = function Api(scribe) {
    this.CommandPatch = buildCommandPatch(scribe);
    this.Command = buildCommand(scribe);
    this.Node = Node;
    this.Selection = buildSelection(scribe);
    this.SimpleCommand = buildSimpleCommand(this, scribe);
};
},{"./api/command":72,"./api/command-patch":71,"./api/node":74,"./api/selection":75,"./api/simple-command":76}],71:[function(_dereq_,module,exports){
'use strict';
module.exports = function (scribe) {
    function CommandPatch(commandName) {
        this.commandName = commandName;
    }
    CommandPatch.prototype.execute = function (value) {
        scribe.transactionManager.run(function () {
            document.execCommand(this.commandName, false, value || null);
        }.bind(this));
    };
    CommandPatch.prototype.queryState = function () {
        return document.queryCommandState(this.commandName);
    };
    CommandPatch.prototype.queryEnabled = function () {
        return document.queryCommandEnabled(this.commandName);
    };
    return CommandPatch;
};
},{}],72:[function(_dereq_,module,exports){
'use strict';
module.exports = function (scribe) {
    function Command(commandName) {
        this.commandName = commandName;
        this.patch = scribe.commandPatches[this.commandName];
    }
    Command.prototype.execute = function (value) {
        if (this.patch) {
            this.patch.execute(value);
        } else {
            scribe.transactionManager.run(function () {
                document.execCommand(this.commandName, false, value || null);
            }.bind(this));
        }
    };
    Command.prototype.queryState = function () {
        if (this.patch) {
            return this.patch.queryState();
        } else {
            return document.queryCommandState(this.commandName);
        }
    };
    Command.prototype.queryEnabled = function () {
        if (this.patch) {
            return this.patch.queryEnabled();
        } else {
            return document.queryCommandEnabled(this.commandName);
        }
    };
    return Command;
};
},{}],73:[function(_dereq_,module,exports){
var contains = _dereq_('lodash-amd/modern/collections/contains');
'use strict';
var blockElementNames = [
        'P',
        'LI',
        'DIV',
        'BLOCKQUOTE',
        'UL',
        'OL',
        'H1',
        'H2',
        'H3',
        'H4',
        'H5',
        'H6'
    ];
function isBlockElement(node) {
    return contains(blockElementNames, node.nodeName);
}
function unwrap(node, childNode) {
    while (childNode.childNodes.length > 0) {
        node.insertBefore(childNode.childNodes[0], childNode);
    }
    node.removeChild(childNode);
}
module.exports = {
    isBlockElement: isBlockElement,
    unwrap: unwrap
};
},{"lodash-amd/modern/collections/contains":6}],74:[function(_dereq_,module,exports){
'use strict';
function Node(node) {
    this.node = node;
}
Node.prototype.getAncestor = function (nodeFilter) {
    var isTopContainerElement = function (element) {
        return element && element.attributes && element.attributes.getNamedItem('contenteditable');
    };
    if (isTopContainerElement(this.node)) {
        return;
    }
    var currentNode = this.node.parentNode;
    while (currentNode && !isTopContainerElement(currentNode)) {
        if (nodeFilter(currentNode)) {
            return currentNode;
        }
        currentNode = currentNode.parentNode;
    }
};
Node.prototype.nextAll = function () {
    var all = [];
    var el = this.node.nextSibling;
    while (el) {
        all.push(el);
        el = el.nextSibling;
    }
    return all;
};
module.exports = Node;
},{}],75:[function(_dereq_,module,exports){
'use strict';
module.exports = function (scribe) {
    function Selection() {
        this.selection = window.getSelection();
        if (this.selection.rangeCount) {
            this.range = this.selection.getRangeAt(0);
        }
    }
    Selection.prototype.getContaining = function (nodeFilter) {
        var node = new scribe.api.Node(this.range.commonAncestorContainer);
        var isTopContainerElement = node.node && node.node.attributes && node.node.attributes.getNamedItem('contenteditable');
        return !isTopContainerElement && nodeFilter(node.node) ? node.node : node.getAncestor(nodeFilter);
    };
    Selection.prototype.placeMarkers = function () {
        var startMarker = document.createElement('em');
        startMarker.classList.add('scribe-marker');
        var endMarker = document.createElement('em');
        endMarker.classList.add('scribe-marker');
        var rangeEnd = this.range.cloneRange();
        rangeEnd.collapse(false);
        rangeEnd.insertNode(endMarker);
        if (endMarker.nextSibling && endMarker.nextSibling.nodeType === Node.TEXT_NODE && endMarker.nextSibling.data === '') {
            endMarker.parentNode.removeChild(endMarker.nextSibling);
        }
        if (endMarker.previousSibling && endMarker.previousSibling.nodeType === Node.TEXT_NODE && endMarker.previousSibling.data === '') {
            endMarker.parentNode.removeChild(endMarker.previousSibling);
        }
        if (!this.selection.isCollapsed) {
            var rangeStart = this.range.cloneRange();
            rangeStart.collapse(true);
            rangeStart.insertNode(startMarker);
            if (startMarker.nextSibling && startMarker.nextSibling.nodeType === Node.TEXT_NODE && startMarker.nextSibling.data === '') {
                startMarker.parentNode.removeChild(startMarker.nextSibling);
            }
            if (startMarker.previousSibling && startMarker.previousSibling.nodeType === Node.TEXT_NODE && startMarker.previousSibling.data === '') {
                startMarker.parentNode.removeChild(startMarker.previousSibling);
            }
        }
        this.selection.removeAllRanges();
        this.selection.addRange(this.range);
    };
    Selection.prototype.getMarkers = function () {
        return scribe.el.querySelectorAll('em.scribe-marker');
    };
    Selection.prototype.removeMarkers = function () {
        var markers = this.getMarkers();
        Array.prototype.forEach.call(markers, function (marker) {
            marker.parentNode.removeChild(marker);
        });
    };
    Selection.prototype.selectMarkers = function (keepMarkers) {
        var markers = this.getMarkers();
        if (!markers.length) {
            return;
        }
        var newRange = document.createRange();
        newRange.setStartBefore(markers[0]);
        if (markers.length >= 2) {
            newRange.setEndAfter(markers[1]);
        } else {
            newRange.setEndAfter(markers[0]);
        }
        if (!keepMarkers) {
            this.removeMarkers();
        }
        this.selection.removeAllRanges();
        this.selection.addRange(newRange);
    };
    Selection.prototype.isCaretOnNewLine = function () {
        var containerPElement = this.getContaining(function (node) {
                return node.nodeName === 'P';
            });
        if (containerPElement) {
            var containerPElementInnerHTML = containerPElement.innerHTML.trim();
            return containerPElement.nodeName === 'P' && (containerPElementInnerHTML === '<br>' || containerPElementInnerHTML === '');
        } else {
            return false;
        }
    };
    return Selection;
};
},{}],76:[function(_dereq_,module,exports){
'use strict';
module.exports = function (api, scribe) {
    function SimpleCommand(commandName, nodeName) {
        scribe.api.Command.call(this, commandName);
        this.nodeName = nodeName;
    }
    SimpleCommand.prototype = Object.create(api.Command.prototype);
    SimpleCommand.prototype.constructor = SimpleCommand;
    SimpleCommand.prototype.queryState = function () {
        var selection = new scribe.api.Selection();
        return scribe.api.Command.prototype.queryState.call(this) && !!selection.getContaining(function (node) {
            return node.nodeName === this.nodeName;
        }.bind(this));
    };
    return SimpleCommand;
};
},{}],77:[function(_dereq_,module,exports){
var flatten = _dereq_('lodash-amd/modern/arrays/flatten'), toArray = _dereq_('lodash-amd/modern/collections/toArray'), elementHelpers = _dereq_('scribe-common/element'), nodeHelpers = _dereq_('scribe-common/node');
function observeDomChanges(el, callback) {
    function includeRealMutations(mutations) {
        var allChangedNodes = flatten(mutations.map(function (mutation) {
                var added = toArray(mutation.addedNodes);
                var removed = toArray(mutation.removedNodes);
                return added.concat(removed);
            }));
        var realChangedNodes = allChangedNodes.filter(function (n) {
                return !nodeHelpers.isEmptyTextNode(n);
            }).filter(function (n) {
                return !elementHelpers.isSelectionMarkerNode(n);
            });
        return realChangedNodes.length > 0;
    }
    var runningPostMutation = false;
    var observer = new MutationObserver(function (mutations) {
            if (!runningPostMutation && includeRealMutations(mutations)) {
                runningPostMutation = true;
                try {
                    callback();
                } finally {
                    setTimeout(function () {
                        runningPostMutation = false;
                    }, 0);
                }
            }
        });
    observer.observe(el, {
        attributes: true,
        childList: true,
        subtree: true
    });
    return observer;
}
module.exports = observeDomChanges;
},{"lodash-amd/modern/arrays/flatten":3,"lodash-amd/modern/collections/toArray":9,"scribe-common/element":55,"scribe-common/node":56}],78:[function(_dereq_,module,exports){
var pull = _dereq_('lodash-amd/modern/arrays/pull');
'use strict';
function EventEmitter() {
    this._listeners = {};
}
EventEmitter.prototype.on = function (eventName, fn) {
    var listeners = this._listeners[eventName] || [];
    listeners.push(fn);
    this._listeners[eventName] = listeners;
};
EventEmitter.prototype.off = function (eventName, fn) {
    var listeners = this._listeners[eventName] || [];
    if (fn) {
        pull(listeners, fn);
    } else {
        delete this._listeners[eventName];
    }
};
EventEmitter.prototype.trigger = function (eventName, args) {
    var listeners = this._listeners[eventName] || [];
    listeners.forEach(function (listener) {
        listener.apply(null, args);
    });
};
module.exports = EventEmitter;
},{"lodash-amd/modern/arrays/pull":5}],79:[function(_dereq_,module,exports){
var indent = _dereq_('./commands/indent'), insertList = _dereq_('./commands/insert-list'), outdent = _dereq_('./commands/outdent'), redo = _dereq_('./commands/redo'), subscript = _dereq_('./commands/subscript'), superscript = _dereq_('./commands/superscript'), undo = _dereq_('./commands/undo');
'use strict';
module.exports = {
    indent: indent,
    insertList: insertList,
    outdent: outdent,
    redo: redo,
    subscript: subscript,
    superscript: superscript,
    undo: undo
};
},{"./commands/indent":80,"./commands/insert-list":81,"./commands/outdent":82,"./commands/redo":83,"./commands/subscript":84,"./commands/superscript":85,"./commands/undo":86}],80:[function(_dereq_,module,exports){
'use strict';
module.exports = function () {
    return function (scribe) {
        var indentCommand = new scribe.api.Command('indent');
        indentCommand.queryEnabled = function () {
            var selection = new scribe.api.Selection();
            var listElement = selection.getContaining(function (element) {
                    return element.nodeName === 'UL' || element.nodeName === 'OL';
                });
            return scribe.api.Command.prototype.queryEnabled.call(this) && scribe.allowsBlockElements() && !listElement;
        };
        scribe.commands.indent = indentCommand;
    };
};
},{}],81:[function(_dereq_,module,exports){
'use strict';
module.exports = function () {
    return function (scribe) {
        var InsertListCommand = function (commandName) {
            scribe.api.Command.call(this, commandName);
        };
        InsertListCommand.prototype = Object.create(scribe.api.Command.prototype);
        InsertListCommand.prototype.constructor = InsertListCommand;
        InsertListCommand.prototype.execute = function (value) {
            function splitList(listItemElements) {
                if (listItemElements.length > 0) {
                    var newListNode = document.createElement(listNode.nodeName);
                    listItemElements.forEach(function (listItemElement) {
                        newListNode.appendChild(listItemElement);
                    });
                    listNode.parentNode.insertBefore(newListNode, listNode.nextElementSibling);
                }
            }
            if (this.queryState()) {
                var selection = new scribe.api.Selection();
                var range = selection.range;
                var listNode = selection.getContaining(function (node) {
                        return node.nodeName === 'OL' || node.nodeName === 'UL';
                    });
                var listItemElement = selection.getContaining(function (node) {
                        return node.nodeName === 'LI';
                    });
                scribe.transactionManager.run(function () {
                    if (listItemElement) {
                        var nextListItemElements = new scribe.api.Node(listItemElement).nextAll();
                        splitList(nextListItemElements);
                        selection.placeMarkers();
                        var pNode = document.createElement('p');
                        pNode.innerHTML = listItemElement.innerHTML;
                        listNode.parentNode.insertBefore(pNode, listNode.nextElementSibling);
                        listItemElement.parentNode.removeChild(listItemElement);
                    } else {
                        var selectedListItemElements = Array.prototype.map.call(listNode.querySelectorAll('li'), function (listItemElement) {
                                return range.intersectsNode(listItemElement) && listItemElement;
                            }).filter(function (listItemElement) {
                                return listItemElement;
                            });
                        var lastSelectedListItemElement = selectedListItemElements.slice(-1)[0];
                        var listItemElementsAfterSelection = new scribe.api.Node(lastSelectedListItemElement).nextAll();
                        splitList(listItemElementsAfterSelection);
                        selection.placeMarkers();
                        var documentFragment = document.createDocumentFragment();
                        selectedListItemElements.forEach(function (listItemElement) {
                            var pElement = document.createElement('p');
                            pElement.innerHTML = listItemElement.innerHTML;
                            documentFragment.appendChild(pElement);
                        });
                        listNode.parentNode.insertBefore(documentFragment, listNode.nextElementSibling);
                        selectedListItemElements.forEach(function (listItemElement) {
                            listItemElement.parentNode.removeChild(listItemElement);
                        });
                    }
                    if (listNode.childNodes.length === 0) {
                        listNode.parentNode.removeChild(listNode);
                    }
                    selection.selectMarkers();
                }.bind(this));
            } else {
                scribe.api.Command.prototype.execute.call(this, value);
            }
        };
        InsertListCommand.prototype.queryEnabled = function () {
            return scribe.api.Command.prototype.queryEnabled.call(this) && scribe.allowsBlockElements();
        };
        scribe.commands.insertOrderedList = new InsertListCommand('insertOrderedList');
        scribe.commands.insertUnorderedList = new InsertListCommand('insertUnorderedList');
    };
};
},{}],82:[function(_dereq_,module,exports){
'use strict';
module.exports = function () {
    return function (scribe) {
        var outdentCommand = new scribe.api.Command('outdent');
        outdentCommand.queryEnabled = function () {
            var selection = new scribe.api.Selection();
            var listElement = selection.getContaining(function (element) {
                    return element.nodeName === 'UL' || element.nodeName === 'OL';
                });
            return scribe.api.Command.prototype.queryEnabled.call(this) && scribe.allowsBlockElements() && !listElement;
        };
        scribe.commands.outdent = outdentCommand;
    };
};
},{}],83:[function(_dereq_,module,exports){
'use strict';
module.exports = function () {
    return function (scribe) {
        var redoCommand = new scribe.api.Command('redo');
        redoCommand.execute = function () {
            var historyItem = scribe.undoManager.redo();
            if (typeof historyItem !== 'undefined') {
                scribe.restoreFromHistory(historyItem);
            }
        };
        redoCommand.queryEnabled = function () {
            return scribe.undoManager.position < scribe.undoManager.stack.length - 1;
        };
        scribe.commands.redo = redoCommand;
        scribe.el.addEventListener('keydown', function (event) {
            if (event.shiftKey && (event.metaKey || event.ctrlKey) && event.keyCode === 90) {
                event.preventDefault();
                redoCommand.execute();
            }
        });
    };
};
},{}],84:[function(_dereq_,module,exports){
'use strict';
module.exports = function () {
    return function (scribe) {
        var subscriptCommand = new scribe.api.Command('subscript');
        scribe.commands.subscript = subscriptCommand;
    };
};
},{}],85:[function(_dereq_,module,exports){
'use strict';
module.exports = function () {
    return function (scribe) {
        var superscriptCommand = new scribe.api.Command('superscript');
        scribe.commands.superscript = superscriptCommand;
    };
};
},{}],86:[function(_dereq_,module,exports){
'use strict';
module.exports = function () {
    return function (scribe) {
        var undoCommand = new scribe.api.Command('undo');
        undoCommand.execute = function () {
            var historyItem = scribe.undoManager.undo();
            if (typeof historyItem !== 'undefined') {
                scribe.restoreFromHistory(historyItem);
            }
        };
        undoCommand.queryEnabled = function () {
            return scribe.undoManager.position > 1;
        };
        scribe.commands.undo = undoCommand;
        scribe.el.addEventListener('keydown', function (event) {
            if (!event.shiftKey && (event.metaKey || event.ctrlKey) && event.keyCode === 90) {
                event.preventDefault();
                undoCommand.execute();
            }
        });
    };
};
},{}],87:[function(_dereq_,module,exports){
var contains = _dereq_('lodash-amd/modern/collections/contains'), observeDomChanges = _dereq_('../../dom-observer');
'use strict';
module.exports = function () {
    return function (scribe) {
        var pushHistoryOnFocus = function () {
                setTimeout(function () {
                    scribe.pushHistory();
                }.bind(scribe), 0);
                scribe.el.removeEventListener('focus', pushHistoryOnFocus);
            }.bind(scribe);
        scribe.el.addEventListener('focus', pushHistoryOnFocus);
        scribe.el.addEventListener('focus', function placeCaretOnFocus() {
            var selection = new scribe.api.Selection();
            if (selection.range) {
                selection.placeMarkers();
                var isFirefoxBug = scribe.allowsBlockElements() && scribe.getHTML().match(/^<em class="scribe-marker"><\/em>/);
                selection.removeMarkers();
                if (isFirefoxBug) {
                    var focusElement = getFirstDeepestChild(scribe.el.firstChild);
                    var range = selection.range;
                    range.setStart(focusElement, 0);
                    range.setEnd(focusElement, 0);
                    selection.selection.removeAllRanges();
                    selection.selection.addRange(range);
                }
            }
            function getFirstDeepestChild(node) {
                var treeWalker = document.createTreeWalker(node);
                var previousNode = treeWalker.currentNode;
                if (treeWalker.firstChild()) {
                    if (treeWalker.currentNode.nodeName === 'BR') {
                        return previousNode;
                    } else {
                        return getFirstDeepestChild(treeWalker.currentNode);
                    }
                } else {
                    return treeWalker.currentNode;
                }
            }
        }.bind(scribe));
        var applyFormatters = function () {
                if (!scribe._skipFormatters) {
                    var selection = new scribe.api.Selection();
                    var isEditorActive = selection.range;
                    var runFormatters = function () {
                            if (isEditorActive) {
                                selection.placeMarkers();
                            }
                            scribe.setHTML(scribe._htmlFormatterFactory.format(scribe.getHTML()));
                            selection.selectMarkers();
                        }.bind(scribe);
                    if (isEditorActive) {
                        scribe.undoManager.undo();
                        scribe.transactionManager.run(runFormatters);
                    } else {
                        runFormatters();
                    }
                }
                delete scribe._skipFormatters;
            }.bind(scribe);
        observeDomChanges(scribe.el, applyFormatters);
        if (scribe.allowsBlockElements()) {
            scribe.el.addEventListener('keydown', function (event) {
                if (event.keyCode === 13) {
                    var selection = new scribe.api.Selection();
                    var range = selection.range;
                    var headingNode = selection.getContaining(function (node) {
                            return /^(H[1-6])$/.test(node.nodeName);
                        });
                    if (headingNode && range.collapsed) {
                        var contentToEndRange = range.cloneRange();
                        contentToEndRange.setEndAfter(headingNode, 0);
                        var contentToEndFragment = contentToEndRange.cloneContents();
                        if (contentToEndFragment.firstChild.textContent === '') {
                            event.preventDefault();
                            scribe.transactionManager.run(function () {
                                var pNode = document.createElement('p');
                                var brNode = document.createElement('br');
                                pNode.appendChild(brNode);
                                headingNode.parentNode.insertBefore(pNode, headingNode.nextElementSibling);
                                range.setStart(pNode, 0);
                                range.setEnd(pNode, 0);
                                selection.selection.removeAllRanges();
                                selection.selection.addRange(range);
                            });
                        }
                    }
                }
            });
        }
        if (scribe.allowsBlockElements()) {
            scribe.el.addEventListener('keydown', function (event) {
                if (event.keyCode === 13 || event.keyCode === 8) {
                    var selection = new scribe.api.Selection();
                    var range = selection.range;
                    if (range.collapsed) {
                        var containerLIElement = selection.getContaining(function (node) {
                                return node.nodeName === 'LI';
                            });
                        if (containerLIElement && containerLIElement.textContent.trim() === '') {
                            event.preventDefault();
                            var listNode = selection.getContaining(function (node) {
                                    return node.nodeName === 'UL' || node.nodeName === 'OL';
                                });
                            var command = scribe.getCommand(listNode.nodeName === 'OL' ? 'insertOrderedList' : 'insertUnorderedList');
                            command.execute();
                        }
                    }
                }
            });
        }
        scribe.el.addEventListener('paste', function handlePaste(event) {
            if (event.clipboardData) {
                event.preventDefault();
                if (contains(event.clipboardData.types, 'text/html')) {
                    scribe.insertHTML(event.clipboardData.getData('text/html'));
                } else {
                    scribe.insertPlainText(event.clipboardData.getData('text/plain'));
                }
            } else {
                var selection = new scribe.api.Selection();
                selection.placeMarkers();
                var bin = document.createElement('div');
                document.body.appendChild(bin);
                bin.setAttribute('contenteditable', true);
                bin.focus();
                setTimeout(function () {
                    var data = bin.innerHTML;
                    bin.parentNode.removeChild(bin);
                    selection.selectMarkers();
                    scribe.el.focus();
                    scribe.insertHTML(data);
                }, 1);
            }
        });
    };
};
},{"../../dom-observer":77,"lodash-amd/modern/collections/contains":6}],88:[function(_dereq_,module,exports){
var last = _dereq_('lodash-amd/modern/arrays/last'), element = _dereq_('../../../../api/element');
'use strict';
function wrapChildNodes(parentNode) {
    var groups = Array.prototype.reduce.call(parentNode.childNodes, function (accumulator, binChildNode) {
            var group = last(accumulator);
            if (!group) {
                startNewGroup();
            } else {
                var isBlockGroup = element.isBlockElement(group[0]);
                if (isBlockGroup === element.isBlockElement(binChildNode)) {
                    group.push(binChildNode);
                } else {
                    startNewGroup();
                }
            }
            return accumulator;
            function startNewGroup() {
                var newGroup = [binChildNode];
                accumulator.push(newGroup);
            }
        }, []);
    var consecutiveInlineElementsAndTextNodes = groups.filter(function (group) {
            var isBlockGroup = element.isBlockElement(group[0]);
            return !isBlockGroup;
        });
    consecutiveInlineElementsAndTextNodes.forEach(function (nodes) {
        var pElement = document.createElement('p');
        nodes[0].parentNode.insertBefore(pElement, nodes[0]);
        nodes.forEach(function (node) {
            pElement.appendChild(node);
        });
    });
    parentNode._isWrapped = true;
}
function traverse(parentNode) {
    var treeWalker = document.createTreeWalker(parentNode, NodeFilter.SHOW_ELEMENT);
    var node = treeWalker.firstChild();
    while (node) {
        if (node.nodeName === 'BLOCKQUOTE' && !node._isWrapped) {
            wrapChildNodes(node);
            traverse(parentNode);
            break;
        }
        node = treeWalker.nextSibling();
    }
}
module.exports = function () {
    return function (scribe) {
        scribe.registerHTMLFormatter('normalize', function (html) {
            var bin = document.createElement('div');
            bin.innerHTML = html;
            wrapChildNodes(bin);
            traverse(bin);
            return bin.innerHTML;
        });
    };
};
},{"../../../../api/element":73,"lodash-amd/modern/arrays/last":4}],89:[function(_dereq_,module,exports){
var element = _dereq_('scribe-common/element'), contains = _dereq_('lodash-amd/modern/collections/contains');
'use strict';
var html5VoidElements = [
        'AREA',
        'BASE',
        'BR',
        'COL',
        'COMMAND',
        'EMBED',
        'HR',
        'IMG',
        'INPUT',
        'KEYGEN',
        'LINK',
        'META',
        'PARAM',
        'SOURCE',
        'TRACK',
        'WBR'
    ];
function traverse(parentNode) {
    var node = parentNode.firstElementChild;
    function isEmpty(node) {
        return node.children.length === 0 || node.children.length === 1 && element.isSelectionMarkerNode(node.children[0]);
    }
    while (node) {
        if (!element.isSelectionMarkerNode(node)) {
            if (isEmpty(node) && node.textContent.trim() === '' && !contains(html5VoidElements, node.nodeName)) {
                node.appendChild(document.createElement('br'));
            } else if (node.children.length > 0) {
                traverse(node);
            }
        }
        node = node.nextElementSibling;
    }
}
module.exports = function () {
    return function (scribe) {
        scribe.registerHTMLFormatter('normalize', function (html) {
            var bin = document.createElement('div');
            bin.innerHTML = html;
            traverse(bin);
            return bin.innerHTML;
        });
    };
};
},{"lodash-amd/modern/collections/contains":6,"scribe-common/element":55}],90:[function(_dereq_,module,exports){
'use strict';
module.exports = function () {
    return function (scribe) {
        var nbspChar = '&nbsp;|\xa0';
        var nbspCharRegExp = new RegExp(nbspChar, 'g');
        scribe.registerHTMLFormatter('normalize', function (html) {
            return html.replace(nbspCharRegExp, ' ');
        });
    };
};
},{}],91:[function(_dereq_,module,exports){
var escape = _dereq_('lodash-amd/modern/utilities/escape');
'use strict';
module.exports = function () {
    return function (scribe) {
        scribe.registerPlainTextFormatter(escape);
    };
};
},{"lodash-amd/modern/utilities/escape":51}],92:[function(_dereq_,module,exports){
'use strict';
function hasContent(rootNode) {
    var treeWalker = document.createTreeWalker(rootNode);
    while (treeWalker.nextNode()) {
        if (treeWalker.currentNode) {
            if (~['br'].indexOf(treeWalker.currentNode.nodeName.toLowerCase()) || treeWalker.currentNode.length > 0) {
                return true;
            }
        }
    }
    return false;
}
module.exports = function () {
    return function (scribe) {
        scribe.el.addEventListener('keydown', function (event) {
            if (event.keyCode === 13) {
                var selection = new scribe.api.Selection();
                var range = selection.range;
                var blockNode = selection.getContaining(function (node) {
                        return node.nodeName === 'LI' || /^(H[1-6])$/.test(node.nodeName);
                    });
                if (!blockNode) {
                    event.preventDefault();
                    scribe.transactionManager.run(function () {
                        if (scribe.el.lastChild.nodeName === 'BR') {
                            scribe.el.removeChild(scribe.el.lastChild);
                        }
                        var brNode = document.createElement('br');
                        range.insertNode(brNode);
                        range.collapse(false);
                        var contentToEndRange = range.cloneRange();
                        contentToEndRange.setEndAfter(scribe.el.lastChild, 0);
                        var contentToEndFragment = contentToEndRange.cloneContents();
                        if (!hasContent(contentToEndFragment)) {
                            var bogusBrNode = document.createElement('br');
                            range.insertNode(bogusBrNode);
                        }
                        var newRange = range.cloneRange();
                        newRange.setStartAfter(brNode, 0);
                        newRange.setEndAfter(brNode, 0);
                        selection.selection.removeAllRanges();
                        selection.selection.addRange(newRange);
                    });
                }
            }
        }.bind(this));
        if (scribe.getHTML().trim() === '') {
            scribe.setContent('');
        }
    };
};
},{}],93:[function(_dereq_,module,exports){
var boldCommand = _dereq_('./patches/commands/bold'), indentCommand = _dereq_('./patches/commands/indent'), insertHTMLCommand = _dereq_('./patches/commands/insert-html'), insertListCommands = _dereq_('./patches/commands/insert-list'), outdentCommand = _dereq_('./patches/commands/outdent'), createLinkCommand = _dereq_('./patches/commands/create-link'), events = _dereq_('./patches/events');
'use strict';
module.exports = {
    commands: {
        bold: boldCommand,
        indent: indentCommand,
        insertHTML: insertHTMLCommand,
        insertList: insertListCommands,
        outdent: outdentCommand,
        createLink: createLinkCommand
    },
    events: events
};
},{"./patches/commands/bold":94,"./patches/commands/create-link":95,"./patches/commands/indent":96,"./patches/commands/insert-html":97,"./patches/commands/insert-list":98,"./patches/commands/outdent":99,"./patches/events":100}],94:[function(_dereq_,module,exports){
'use strict';
module.exports = function () {
    return function (scribe) {
        var boldCommand = new scribe.api.CommandPatch('bold');
        boldCommand.queryEnabled = function () {
            var selection = new scribe.api.Selection();
            var headingNode = selection.getContaining(function (node) {
                    return /^(H[1-6])$/.test(node.nodeName);
                });
            return scribe.api.CommandPatch.prototype.queryEnabled.apply(this, arguments) && !headingNode;
        };
        scribe.commandPatches.bold = boldCommand;
    };
};
},{}],95:[function(_dereq_,module,exports){
'use strict';
module.exports = function () {
    return function (scribe) {
        var createLinkCommand = new scribe.api.CommandPatch('createLink');
        scribe.commandPatches.createLink = createLinkCommand;
        createLinkCommand.execute = function (value) {
            var selection = new scribe.api.Selection();
            if (selection.selection.isCollapsed) {
                var aElement = document.createElement('a');
                aElement.setAttribute('href', value);
                aElement.textContent = value;
                selection.range.insertNode(aElement);
                var newRange = document.createRange();
                newRange.setStartBefore(aElement);
                newRange.setEndAfter(aElement);
                selection.selection.removeAllRanges();
                selection.selection.addRange(newRange);
            } else {
                scribe.api.CommandPatch.prototype.execute.call(this, value);
            }
        };
    };
};
},{}],96:[function(_dereq_,module,exports){
'use strict';
var INVISIBLE_CHAR = '\ufeff';
module.exports = function () {
    return function (scribe) {
        var indentCommand = new scribe.api.CommandPatch('indent');
        indentCommand.execute = function (value) {
            scribe.transactionManager.run(function () {
                var selection = new scribe.api.Selection();
                var range = selection.range;
                var isCaretOnNewLine = range.commonAncestorContainer.nodeName === 'P' && range.commonAncestorContainer.innerHTML === '<br>';
                if (isCaretOnNewLine) {
                    var textNode = document.createTextNode(INVISIBLE_CHAR);
                    range.insertNode(textNode);
                    range.setStart(textNode, 0);
                    range.setEnd(textNode, 0);
                    selection.selection.removeAllRanges();
                    selection.selection.addRange(range);
                }
                scribe.api.CommandPatch.prototype.execute.call(this, value);
                selection = new scribe.api.Selection();
                var blockquoteNode = selection.getContaining(function (node) {
                        return node.nodeName === 'BLOCKQUOTE';
                    });
                if (blockquoteNode) {
                    blockquoteNode.removeAttribute('style');
                }
            }.bind(this));
        };
        scribe.commandPatches.indent = indentCommand;
    };
};
},{}],97:[function(_dereq_,module,exports){
var element = _dereq_('../../../../api/element');
'use strict';
module.exports = function () {
    return function (scribe) {
        var insertHTMLCommandPatch = new scribe.api.CommandPatch('insertHTML');
        insertHTMLCommandPatch.execute = function (value) {
            scribe.transactionManager.run(function () {
                scribe.api.CommandPatch.prototype.execute.call(this, value);
                sanitize(scribe.el);
                function sanitize(parentNode) {
                    var treeWalker = document.createTreeWalker(parentNode, NodeFilter.SHOW_ELEMENT);
                    var node = treeWalker.firstChild();
                    if (!node) {
                        return;
                    }
                    do {
                        if (node.nodeName === 'SPAN') {
                            element.unwrap(parentNode, node);
                        } else {
                            node.style.lineHeight = null;
                            if (node.getAttribute('style') === '') {
                                node.removeAttribute('style');
                            }
                        }
                        sanitize(node);
                    } while (node = treeWalker.nextSibling());
                }
            }.bind(this));
        };
        scribe.commandPatches.insertHTML = insertHTMLCommandPatch;
    };
};
},{"../../../../api/element":73}],98:[function(_dereq_,module,exports){
var element = _dereq_('../../../../api/element'), nodeHelpers = _dereq_('scribe-common/node');
'use strict';
module.exports = function () {
    return function (scribe) {
        var InsertListCommandPatch = function (commandName) {
            scribe.api.CommandPatch.call(this, commandName);
        };
        InsertListCommandPatch.prototype = Object.create(scribe.api.CommandPatch.prototype);
        InsertListCommandPatch.prototype.constructor = InsertListCommandPatch;
        InsertListCommandPatch.prototype.execute = function (value) {
            scribe.transactionManager.run(function () {
                scribe.api.CommandPatch.prototype.execute.call(this, value);
                if (this.queryState()) {
                    var selection = new scribe.api.Selection();
                    var listElement = selection.getContaining(function (node) {
                            return node.nodeName === 'OL' || node.nodeName === 'UL';
                        });
                    if (listElement.nextElementSibling && listElement.nextElementSibling.childNodes.length === 0) {
                        nodeHelpers.removeNode(listElement.nextElementSibling);
                    }
                    if (listElement) {
                        var listParentNode = listElement.parentNode;
                        if (listParentNode && /^(H[1-6]|P)$/.test(listParentNode.nodeName)) {
                            selection.placeMarkers();
                            nodeHelpers.insertAfter(listElement, listParentNode);
                            selection.selectMarkers();
                            if (listParentNode.childNodes.length === 2 && nodeHelpers.isEmptyTextNode(listParentNode.firstChild)) {
                                nodeHelpers.removeNode(listParentNode);
                            }
                            if (listParentNode.childNodes.length === 0) {
                                nodeHelpers.removeNode(listParentNode);
                            }
                        }
                    }
                    var listItemElements = Array.prototype.slice.call(listElement.childNodes);
                    listItemElements.forEach(function (listItemElement) {
                        var listItemElementChildNodes = Array.prototype.slice.call(listItemElement.childNodes);
                        listItemElementChildNodes.forEach(function (listElementChildNode) {
                            if (listElementChildNode.nodeName === 'SPAN') {
                                var spanElement = listElementChildNode;
                                element.unwrap(listItemElement, spanElement);
                            } else if (listElementChildNode.nodeType === Node.ELEMENT_NODE) {
                                listElementChildNode.style.lineHeight = null;
                                if (listElementChildNode.getAttribute('style') === '') {
                                    listElementChildNode.removeAttribute('style');
                                }
                            }
                        });
                    });
                }
            }.bind(this));
        };
        scribe.commandPatches.insertOrderedList = new InsertListCommandPatch('insertOrderedList');
        scribe.commandPatches.insertUnorderedList = new InsertListCommandPatch('insertUnorderedList');
    };
};
},{"../../../../api/element":73,"scribe-common/node":56}],99:[function(_dereq_,module,exports){
'use strict';
module.exports = function () {
    return function (scribe) {
        var outdentCommand = new scribe.api.CommandPatch('outdent');
        outdentCommand.execute = function () {
            scribe.transactionManager.run(function () {
                var selection = new scribe.api.Selection();
                var range = selection.range;
                var blockquoteNode = selection.getContaining(function (node) {
                        return node.nodeName === 'BLOCKQUOTE';
                    });
                if (range.commonAncestorContainer.nodeName === 'BLOCKQUOTE') {
                    selection.placeMarkers();
                    selection.selectMarkers(true);
                    var selectedNodes = range.cloneContents();
                    blockquoteNode.parentNode.insertBefore(selectedNodes, blockquoteNode);
                    range.deleteContents();
                    selection.selectMarkers();
                    if (blockquoteNode.textContent === '') {
                        blockquoteNode.parentNode.removeChild(blockquoteNode);
                    }
                } else {
                    var pNode = selection.getContaining(function (node) {
                            return node.nodeName === 'P';
                        });
                    if (pNode) {
                        var nextSiblingNodes = new scribe.api.Node(pNode).nextAll();
                        if (nextSiblingNodes.length) {
                            var newContainerNode = document.createElement(blockquoteNode.nodeName);
                            nextSiblingNodes.forEach(function (siblingNode) {
                                newContainerNode.appendChild(siblingNode);
                            });
                            blockquoteNode.parentNode.insertBefore(newContainerNode, blockquoteNode.nextElementSibling);
                        }
                        selection.placeMarkers();
                        blockquoteNode.parentNode.insertBefore(pNode, blockquoteNode.nextElementSibling);
                        selection.selectMarkers();
                        if (blockquoteNode.innerHTML === '') {
                            blockquoteNode.parentNode.removeChild(blockquoteNode);
                        }
                    } else {
                        scribe.api.CommandPatch.prototype.execute.call(this);
                    }
                }
            }.bind(this));
        };
        scribe.commandPatches.outdent = outdentCommand;
    };
};
},{}],100:[function(_dereq_,module,exports){
var element = _dereq_('../../../api/element');
'use strict';
module.exports = function () {
    return function (scribe) {
        if (scribe.allowsBlockElements()) {
            scribe.el.addEventListener('keyup', function (event) {
                if (event.keyCode === 8 || event.keyCode === 46) {
                    var selection = new scribe.api.Selection();
                    var containerPElement = selection.getContaining(function (node) {
                            return node.nodeName === 'P';
                        });
                    if (containerPElement) {
                        scribe.undoManager.undo();
                        scribe.transactionManager.run(function () {
                            selection.placeMarkers();
                            var pElementChildNodes = Array.prototype.slice.call(containerPElement.childNodes);
                            pElementChildNodes.forEach(function (pElementChildNode) {
                                if (pElementChildNode.nodeName === 'SPAN') {
                                    var spanElement = pElementChildNode;
                                    element.unwrap(containerPElement, spanElement);
                                } else if (pElementChildNode.nodeType === Node.ELEMENT_NODE) {
                                    pElementChildNode.style.lineHeight = null;
                                    if (pElementChildNode.getAttribute('style') === '') {
                                        pElementChildNode.removeAttribute('style');
                                    }
                                }
                            });
                            selection.selectMarkers();
                        });
                    }
                }
            });
        }
    };
};
},{"../../../api/element":73}],101:[function(_dereq_,module,exports){
'use strict';
module.exports = function () {
    return function (scribe) {
        if (scribe.getHTML().trim() === '') {
            scribe.setContent('<p><br></p>');
        }
    };
};
},{}],102:[function(_dereq_,module,exports){
var defaults = _dereq_('lodash-amd/modern/objects/defaults'), flatten = _dereq_('lodash-amd/modern/arrays/flatten'), commands = _dereq_('./plugins/core/commands'), events = _dereq_('./plugins/core/events'), replaceNbspCharsFormatter = _dereq_('./plugins/core/formatters/html/replace-nbsp-chars'), enforcePElements = _dereq_('./plugins/core/formatters/html/enforce-p-elements'), ensureSelectableContainers = _dereq_('./plugins/core/formatters/html/ensure-selectable-containers'), escapeHtmlCharactersFormatter = _dereq_('./plugins/core/formatters/plain-text/escape-html-characters'), inlineElementsMode = _dereq_('./plugins/core/inline-elements-mode'), patches = _dereq_('./plugins/core/patches'), setRootPElement = _dereq_('./plugins/core/set-root-p-element'), Api = _dereq_('./api'), buildTransactionManager = _dereq_('./transaction-manager'), buildUndoManager = _dereq_('./undo-manager'), EventEmitter = _dereq_('./event-emitter');
'use strict';
function Scribe(el, options) {
    EventEmitter.call(this);
    this.el = el;
    this.commands = {};
    this.options = defaults(options || {}, {
        allowBlockElements: true,
        debug: false
    });
    this.commandPatches = {};
    this._plainTextFormatterFactory = new FormatterFactory();
    this._htmlFormatterFactory = new HTMLFormatterFactory();
    this.api = new Api(this);
    var TransactionManager = buildTransactionManager(this);
    this.transactionManager = new TransactionManager();
    var UndoManager = buildUndoManager(this);
    this.undoManager = new UndoManager();
    this.el.setAttribute('contenteditable', true);
    this.el.addEventListener('input', function () {
        this.transactionManager.run();
    }.bind(this), false);
    if (this.allowsBlockElements()) {
        this.use(setRootPElement());
        this.use(enforcePElements());
        this.use(ensureSelectableContainers());
    } else {
        this.use(inlineElementsMode());
    }
    this.use(escapeHtmlCharactersFormatter());
    this.use(replaceNbspCharsFormatter());
    this.use(patches.commands.bold());
    this.use(patches.commands.indent());
    this.use(patches.commands.insertHTML());
    this.use(patches.commands.insertList());
    this.use(patches.commands.outdent());
    this.use(patches.commands.createLink());
    this.use(patches.events());
    this.use(commands.indent());
    this.use(commands.insertList());
    this.use(commands.outdent());
    this.use(commands.redo());
    this.use(commands.subscript());
    this.use(commands.superscript());
    this.use(commands.undo());
    this.use(events());
}
Scribe.prototype = Object.create(EventEmitter.prototype);
Scribe.prototype.use = function (configurePlugin) {
    configurePlugin(this);
    return this;
};
Scribe.prototype.setHTML = function (html, skipFormatters) {
    if (skipFormatters) {
        this._skipFormatters = true;
    }
    this.el.innerHTML = html;
};
Scribe.prototype.getHTML = function () {
    return this.el.innerHTML;
};
Scribe.prototype.getContent = function () {
    return this.getHTML().replace(/<br>$/, '');
};
Scribe.prototype.getTextContent = function () {
    return this.el.textContent;
};
Scribe.prototype.pushHistory = function () {
    var previousUndoItem = this.undoManager.stack[this.undoManager.position];
    var previousContent = previousUndoItem && previousUndoItem.replace(/<em class="scribe-marker">/g, '').replace(/<\/em>/g, '');
    if (!previousUndoItem || previousUndoItem && this.getContent() !== previousContent) {
        var selection = new this.api.Selection();
        selection.placeMarkers();
        var html = this.getHTML();
        selection.removeMarkers();
        this.undoManager.push(html);
        return true;
    } else {
        return false;
    }
};
Scribe.prototype.getCommand = function (commandName) {
    return this.commands[commandName] || this.commandPatches[commandName] || new this.api.Command(commandName);
};
Scribe.prototype.restoreFromHistory = function (historyItem) {
    this.setHTML(historyItem, true);
    var selection = new this.api.Selection();
    selection.selectMarkers();
    this.trigger('content-changed');
};
Scribe.prototype.allowsBlockElements = function () {
    return this.options.allowBlockElements;
};
Scribe.prototype.setContent = function (content) {
    if (!this.allowsBlockElements()) {
        content = content + '<br>';
    }
    this.setHTML(content);
    this.trigger('content-changed');
};
Scribe.prototype.insertPlainText = function (plainText) {
    this.insertHTML('<p>' + this._plainTextFormatterFactory.format(plainText) + '</p>');
};
Scribe.prototype.insertHTML = function (html) {
    this.getCommand('insertHTML').execute(this._htmlFormatterFactory.format(html));
};
Scribe.prototype.isDebugModeEnabled = function () {
    return this.options.debug;
};
Scribe.prototype.registerHTMLFormatter = function (phase, fn) {
    this._htmlFormatterFactory.formatters[phase].push(fn);
};
Scribe.prototype.registerPlainTextFormatter = function (fn) {
    this._plainTextFormatterFactory.formatters.push(fn);
};
function FormatterFactory() {
    this.formatters = [];
}
FormatterFactory.prototype.format = function (html) {
    var formatted = this.formatters.reduce(function (formattedData, formatter) {
            return formatter(formattedData);
        }, html);
    return formatted;
};
function HTMLFormatterFactory() {
    this.formatters = {
        sanitize: [],
        normalize: []
    };
}
HTMLFormatterFactory.prototype = Object.create(FormatterFactory.prototype);
HTMLFormatterFactory.prototype.constructor = HTMLFormatterFactory;
HTMLFormatterFactory.prototype.format = function (html) {
    var formatters = flatten([
            this.formatters.sanitize,
            this.formatters.normalize
        ]);
    var formatted = formatters.reduce(function (formattedData, formatter) {
            return formatter(formattedData);
        }, html);
    return formatted;
};
module.exports = Scribe;
},{"./api":70,"./event-emitter":78,"./plugins/core/commands":79,"./plugins/core/events":87,"./plugins/core/formatters/html/enforce-p-elements":88,"./plugins/core/formatters/html/ensure-selectable-containers":89,"./plugins/core/formatters/html/replace-nbsp-chars":90,"./plugins/core/formatters/plain-text/escape-html-characters":91,"./plugins/core/inline-elements-mode":92,"./plugins/core/patches":93,"./plugins/core/set-root-p-element":101,"./transaction-manager":103,"./undo-manager":104,"lodash-amd/modern/arrays/flatten":3,"lodash-amd/modern/objects/defaults":37}],103:[function(_dereq_,module,exports){
var assign = _dereq_('lodash-amd/modern/objects/assign');
'use strict';
module.exports = function (scribe) {
    function TransactionManager() {
        this.history = [];
    }
    assign(TransactionManager.prototype, {
        start: function () {
            this.history.push(1);
        },
        end: function () {
            this.history.pop();
            if (this.history.length === 0) {
                scribe.pushHistory();
                scribe.trigger('content-changed');
            }
        },
        run: function (transaction) {
            this.start();
            try {
                if (transaction) {
                    transaction();
                }
            } finally {
                this.end();
            }
        }
    });
    return TransactionManager;
};
},{"lodash-amd/modern/objects/assign":35}],104:[function(_dereq_,module,exports){
'use strict';
module.exports = function (scribe) {
    function UndoManager() {
        this.position = -1;
        this.stack = [];
        this.debug = scribe.isDebugModeEnabled();
    }
    UndoManager.prototype.maxStackSize = 100;
    UndoManager.prototype.push = function (item) {
        if (this.debug) {
            console.log('UndoManager.push: %s', item);
        }
        this.stack.length = ++this.position;
        this.stack.push(item);
        while (this.stack.length > this.maxStackSize) {
            this.stack.shift();
            --this.position;
        }
    };
    UndoManager.prototype.undo = function () {
        if (this.position > 0) {
            return this.stack[--this.position];
        }
    };
    UndoManager.prototype.redo = function () {
        if (this.position < this.stack.length - 1) {
            return this.stack[++this.position];
        }
    };
    return UndoManager;
};
},{}]},{},[1])
(1)
});