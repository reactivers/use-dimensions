'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var react = require('react');
var jsxRuntime = require('react/jsx-runtime');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

var DimensionsContext = react.createContext({});
var DimensionsProvider = function (_a) {
    var _b = _a.widths, widths = _b === void 0 ? [576, 768, 992, 1200, 1600, 1800] : _b, _c = _a.sizes, sizes = _c === void 0 ? ["xs", "sm", "md", "lg", "xl", "xxl"] : _c, children = _a.children;
    return (jsxRuntime.jsx(DimensionsContext.Provider, __assign({ value: { sizes: sizes, widths: widths } }, { children: children }), void 0));
};
var useDimensionsContext = function () {
    var context = react.useContext(DimensionsContext);
    if (context === undefined) {
        throw new Error('useDimensionsContext must be used within an DimensionsContext.Provider');
    }
    return context;
};

var isBrowser = function () {
    return typeof window !== "undefined";
};
var takeIf = function (condition, value, defaultValue) {
    if (defaultValue === void 0) { defaultValue = undefined; }
    if (condition) {
        return value;
    }
    else {
        return defaultValue;
    }
};
var isEqualJSON = function (json1, json2) {
    if (json1 === void 0) { json1 = {}; }
    if (json2 === void 0) { json2 = {}; }
    return JSON.stringify(json1) === JSON.stringify(json2);
};
var findLastIndex = function (array, predicate) {
    if (!array)
        return -1;
    var index = array.length - 1;
    if (!predicate)
        return index;
    for (var i = index; i > -1; i--) {
        if (predicate(array[i])) {
            return i;
        }
    }
    return -1;
};

var defaultBreakPoints = ["xs", "sm", "md", "lg", "xl", "xxl"];
var defaultPayload = { breakpoints: defaultBreakPoints, watchWindowSize: false };
var useDimensions = function (payload) {
    if (payload === void 0) { payload = defaultPayload; }
    var breakpoints = react.useMemo(function () { return payload.breakpoints || defaultBreakPoints; }, [payload.breakpoints]);
    var watchWindowSize = react.useMemo(function () { return payload.watchWindowSize; }, [payload.watchWindowSize]);
    var _a = useDimensionsContext(), sizes = _a.sizes, widths = _a.widths;
    var getSizeOfWindowWidth = react.useCallback(function (width) {
        var indexOfWidth = findLastIndex(widths, function (c) { return width >= c; });
        return sizes[takeIf(indexOfWidth > -1, indexOfWidth, 0)];
    }, [findLastIndex, widths, sizes, takeIf]);
    var initialSize = react.useMemo(function () { return getSizeOfWindowWidth(isBrowser() ? window.innerWidth : 0); }, [getSizeOfWindowWidth]);
    var _b = react.useState(isBrowser() ? {
        width: window.innerWidth,
        height: window.innerHeight,
        size: initialSize
    } : {
        width: 0, height: 0, size: 'xxl'
    }), dimensions = _b[0], setDimensions = _b[1];
    var size = dimensions.size;
    var updateDimensions = react.useCallback(function (width, height) {
        var newSize = getSizeOfWindowWidth(width);
        if (!breakpoints.length || breakpoints.indexOf(newSize) > -1) {
            setDimensions(function (oldDimensions) {
                var newDimensions = __assign({}, oldDimensions);
                if (watchWindowSize) {
                    newDimensions.width = width;
                    newDimensions.height = height;
                }
                newDimensions.size = newSize;
                if (isEqualJSON(oldDimensions, newDimensions)) {
                    return oldDimensions;
                }
                return newDimensions;
            });
        }
    }, [breakpoints, getSizeOfWindowWidth, watchWindowSize, isEqualJSON]);
    var getCurrentAndRequestedSizeIndex = react.useCallback(function (_size) {
        var indexOfCurrentSize = sizes.indexOf(size);
        var indexOfSize = sizes.indexOf(_size);
        return [indexOfCurrentSize, indexOfSize];
    }, [sizes, size]);
    var isSizeEqualOrLargerThan = react.useCallback(function (_size) {
        var _a = getCurrentAndRequestedSizeIndex(_size), indexOfCurrentSize = _a[0], indexOfSize = _a[1];
        return indexOfCurrentSize >= indexOfSize;
    }, [getCurrentAndRequestedSizeIndex]);
    var isSizeLargerThan = react.useCallback(function (_size) {
        var _a = getCurrentAndRequestedSizeIndex(_size), indexOfCurrentSize = _a[0], indexOfSize = _a[1];
        return indexOfCurrentSize > indexOfSize;
    }, [getCurrentAndRequestedSizeIndex]);
    var isSizeEqualTo = react.useCallback(function (_size) {
        var _a = getCurrentAndRequestedSizeIndex(_size), indexOfCurrentSize = _a[0], indexOfSize = _a[1];
        return indexOfCurrentSize === indexOfSize;
    }, [getCurrentAndRequestedSizeIndex]);
    var isSizeSmallerThan = react.useCallback(function (_size) {
        var _a = getCurrentAndRequestedSizeIndex(_size), indexOfCurrentSize = _a[0], indexOfSize = _a[1];
        return indexOfCurrentSize < indexOfSize;
    }, [getCurrentAndRequestedSizeIndex]);
    var isSizeEqualOrSmallerThan = react.useCallback(function (_size) {
        var _a = getCurrentAndRequestedSizeIndex(_size), indexOfCurrentSize = _a[0], indexOfSize = _a[1];
        return indexOfCurrentSize <= indexOfSize;
    }, [getCurrentAndRequestedSizeIndex]);
    var onResize = react.useCallback(function (_a) {
        var target = _a.target;
        var innerWidth = target.innerWidth, innerHeight = target.innerHeight;
        updateDimensions(innerWidth, innerHeight);
    }, [updateDimensions]);
    react.useEffect(function () {
        window.addEventListener("resize", onResize);
        return function () {
            window.removeEventListener('resize', onResize);
        };
    }, [onResize]);
    return __assign(__assign({}, dimensions), { isSizeEqualOrLargerThan: isSizeEqualOrLargerThan,
        isSizeLargerThan: isSizeLargerThan,
        isSizeEqualTo: isSizeEqualTo,
        isSizeSmallerThan: isSizeSmallerThan,
        isSizeEqualOrSmallerThan: isSizeEqualOrSmallerThan });
};

exports.DimensionsProvider = DimensionsProvider;
exports.useDimensions = useDimensions;
