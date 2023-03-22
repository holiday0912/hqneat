/**
 * 文件流下载
 */
export function upLoadFile(fileName, type, data) {
  if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(data, fileName);
  } else {
    let blob = new Blob([data], { type: `application/${type};charset=utf-8` });
    // 获取heads中的filename文件名
    let downloadElement = document.createElement("a");
    // 创建下载的链接
    let href = window.URL.createObjectURL(blob);
    downloadElement.href = href;
    // 下载后文件名
    downloadElement.download = fileName;
    document.body.appendChild(downloadElement);
    // 点击下载
    downloadElement.click();
    // 下载完成移除元素
    document.body.removeChild(downloadElement);
    // 释放掉blob对象
    window.URL.revokeObjectURL(href);
  }
}

/**
 * 日期格式化
 *
 * @method dateFormat
 * @param {Date/String/Number} date 所要格式化的日期
 * @param {String} mask 格式化格式："yyyy-mm-dd" | "HH:MM:ss" | "hh:MM:ss tt"等
 * @param {boolean} utc 是否取UTC时间(默认: false)
 * @example
 *     this.dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
 */
export function dateFormat(date, mask, utc) {
  var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloS]|"[^"]*"|'[^']*'/g,
    pad = function(val, len) {
      val = String(val);
      len = len || 2;
      while (val.length < len) {
        val = "0" + val;
      }
      return val;
    },
    masks = {
      default: "yyyy-mm-dd HH:MM:ss",
      shortDate: "m/d/yy",
      shortTime: "h:MM TT",
      mediumTime: "h:MM:ss TT",
      longTime: "h:MM:ss TT Z",
      isoDate: "yyyy-mm-dd",
      isoTime: "HH:MM:ss",
      isoDateTime: "yyyy-mm-dd'T'HH:MM:ss",
      isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
    };

  if (!(date instanceof Date)) {
    date = new Date(date);
  }

  if (isNaN(date)) {
    return "";
  }

  mask = masks[mask] || mask || masks["default"];

  var _ = utc ? "getUTC" : "get",
    d = date[_ + "Date"](),
    // D = date[_ + "Day"](),
    m = date[_ + "Month"](),
    y = date[_ + "FullYear"](),
    H = date[_ + "Hours"](),
    M = date[_ + "Minutes"](),
    s = date[_ + "Seconds"](),
    L = date[_ + "Milliseconds"](),
    o = utc ? 0 : date.getTimezoneOffset(),
    flags = {
      d: d,
      dd: pad(d),
      m: m + 1,
      mm: pad(m + 1),
      yy: String(y).slice(2),
      yyyy: y,
      h: H % 12 || 12,
      hh: pad(H % 12 || 12),
      H: H,
      HH: pad(H),
      M: M,
      MM: pad(M),
      s: s,
      ss: pad(s),
      l: pad(L, 3),
      L: pad(L > 99 ? Math.round(L / 10) : L),
      t: H < 12 ? "a" : "p",
      tt: H < 12 ? "am" : "pm",
      T: H < 12 ? "A" : "P",
      TT: H < 12 ? "AM" : "PM",
      o:
        (o > 0 ? "-" : "+") +
        pad(Math.floor(Math.abs(o) / 60) * 100 + (Math.abs(o) % 60), 4),
      S: ["th", "st", "nd", "rd"][
        d % 10 > 3 ? 0 : (((d % 100) - (d % 10) != 10) * d) % 10
      ]
    };

  return mask.replace(token, function($0) {
    return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
  });
}
