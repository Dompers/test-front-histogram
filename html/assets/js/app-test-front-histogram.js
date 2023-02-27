var env_data = {};(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var rangeStorage;
var numberRangeStorage;
var rangeTransfer;
var numberRangeTransfer;
var RANGES_INFO = [{
  name: "backblaze",
  min_check: 7,
  max_check: "",
  storage: {
    types: [],
    price: 0.005
  },
  transfer: {
    price: 0.01
  },
  free_count: "",
  color: "red"
}, {
  name: "bunny",
  min_check: "",
  max_check: 10,
  storage: {
    types: [{
      name: "HDD",
      price: 0.01
    }, {
      name: "SDD",
      price: 0.02
    }],
    price: ""
  },
  transfer: {
    price: 0.01
  },
  free_count: "",
  color: "orange"
}, {
  name: "scaleway",
  min_check: "",
  max_check: "",
  storage: {
    types: [{
      name: "Multi",
      price: 0.06
    }, {
      name: "Single",
      price: 0.03
    }],
    price: 0.005
  },
  transfer: {
    price: 0.02
  },
  free_count: 75,
  color: "violet"
}, {
  name: "vultr",
  min_check: 5,
  max_check: "",
  storage: {
    types: [],
    price: 0.01
  },
  transfer: {
    price: 0.01
  },
  free_count: "",
  color: "blue"
}];
var setHistItemWidth = function setHistItemWidth(item, price) {
  item.find('.range').width(item.width() / 100 * price);
};
var setHistMinItemColor = function setHistMinItemColor() {
  var ranges = [];
  var resultGrouped = [];
  $(".ranges-histogram-block").find(".ranges-histogram-item").each(function (i, range) {
    var rangeAttr = {};
    rangeAttr['name'] = $(range).attr("id");
    rangeAttr['price'] = parseFloat($(range).find(".price").text());
    ranges.push(rangeAttr);
    $(range).find(".range").css("background", "#ccc");
  });
  ranges.sort(function (a, b) {
    return a.price.toFixed(2) - b.price.toFixed(2);
  });
  resultGrouped = ranges.reduce(function (x, y) {
    (x[y.price] = x[y.price] || []).push(y);
    return x;
  }, {});
  resultGrouped = resultGrouped[ranges[0].price];
  resultGrouped.forEach(function (i, currentRange) {
    var range = RANGES_INFO.filter(function (rangeItem) {
      return rangeItem.name === resultGrouped[currentRange].name;
    });
    $("#" + range[0].name).find('.range').css("background", range[0].color);
  });
};
var setRangeParams = function setRangeParams(range) {
  var rangeStorageVal = parseInt(rangeStorage.noUiSlider.get());
  var rangeTransferVal = parseInt(rangeTransfer.noUiSlider.get());
  var rangeMin = range.min_check;
  var rangeMax = range.max_check;
  var rangeFreeCount = $.isNumeric(range.free_count) ? range.free_count : 0;
  var rangePrice = 0;
  var storagePrice = 0;
  var transferPrice = 0;
  var rangeStoragePrice = 0;
  var rangeTransferPrice = 0;
  var rangeLogoBlock = $("div[data-range-name='" + range.name + "']");
  var rangeHistogramBlock = $("#" + range.name);
  var inputType = 0 !== rangeLogoBlock.find("input[type='radio'][name='range-" + range.name + "']:checked").length ? rangeLogoBlock.find("input[type='radio'][name='range-" + range.name + "']:checked").val() : "";
  var storageType = 0 !== range.storage.types.length ? range.storage.types.filter(function (typeItem) {
    return typeItem.name === inputType;
  }) : [];
  var storageTypePrice = 0 !== storageType.length ? storageType[0].price : 0;
  storagePrice = range.storage.types.length === 0 ? range.storage.price : storageTypePrice;
  transferPrice = range.transfer.price ? range.transfer.price : 0;
  if (rangeFreeCount !== 0 && rangeStorageVal > rangeFreeCount) {
    rangeStoragePrice = (rangeStorageVal - rangeFreeCount) * storagePrice;
  } else if (rangeFreeCount !== 0 && rangeStorageVal < rangeFreeCount) {
    rangeStoragePrice = 0;
  } else {
    rangeStoragePrice = rangeStorageVal * storagePrice;
  }
  if (rangeFreeCount !== 0 && rangeTransferVal > rangeFreeCount) {
    rangeTransferPrice = (rangeTransferVal - rangeFreeCount) * transferPrice;
  } else if (rangeFreeCount !== 0 && rangeTransferVal < rangeFreeCount) {
    rangeTransferPrice = 0;
  } else {
    rangeTransferPrice = rangeTransferVal * transferPrice;
  }
  rangePrice = rangeTransferPrice + rangeStoragePrice;
  if (!$.isNumeric(rangeMax) && $.isNumeric(rangeMin) && rangePrice < rangeMin) {
    rangePrice = rangeMin;
  } else if ($.isNumeric(rangeMin) && $.isNumeric(rangeMax) && rangePrice > rangeMax) {
    rangePrice = rangeMax;
  }
  setHistItemWidth($(rangeHistogramBlock), rangePrice);
  rangeHistogramBlock.find('.price').text((rangePrice % rangePrice.toFixed(0) === 0 ? rangePrice : rangePrice.toFixed(2)) + "$");
};
var setRanges = function setRanges() {
  RANGES_INFO.forEach(function (range) {
    setRangeParams(range);
  });
  setHistMinItemColor();
};
$(document).ready(function () {
  if (0 !== $('#range-storage').length) {
    rangeStorage = document.getElementById('range-storage');
    noUiSlider.create(rangeStorage, {
      start: [100],
      step: 1,
      range: {
        'min': [0],
        'max': [1000]
      },
      pips: {
        mode: 'count',
        values: 2
      }
    });
    rangeStorage.noUiSlider.on('change', function (values, handle) {
      setRanges();
      setHistMinItemColor();
    });
    if (0 !== $('#range-transfer-input')) {
      numberRangeStorage = document.getElementById('range-storage-number');
      rangeStorage.noUiSlider.on('update', function (values, handle) {
        numberRangeStorage.innerHTML = parseInt(values[handle]);
      });
    }
  }
  if (0 !== $('#range-transfer').length) {
    rangeTransfer = document.getElementById('range-transfer');
    noUiSlider.create(rangeTransfer, {
      start: [200],
      step: 1,
      range: {
        'min': [0],
        'max': [1000]
      },
      pips: {
        mode: 'count',
        values: 2
      }
    });
    rangeTransfer.noUiSlider.on('change', function (values, handle) {
      setRanges();
      setHistMinItemColor();
    });
    if (0 !== $('#range-transfer-input')) {
      numberRangeTransfer = document.getElementById('range-transfer-number');
      rangeTransfer.noUiSlider.on('update', function (values, handle) {
        numberRangeTransfer.innerHTML = parseInt(values[handle]);
      });
    }
  }
  $('input[type="radio"]').on('change', function () {
    var _this = this;
    var range = RANGES_INFO.filter(function (rangeItem) {
      return rangeItem.name === $(_this).closest('.ranges-logo').data('rangeName');
    });
    if (0 !== range.length) {
      setRangeParams(range[0]);
      setHistMinItemColor();
    }
  });
  setRanges();
});

},{}]},{},[1]);

//# sourceMappingURL=app-test-front-histogram.js.map
