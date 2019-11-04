
/**
  * 时间转换
  * @param {*} time
  * @param {*} cFormat
  */
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }

  if (!time) return null

  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    // 有种情况 2019-01-10 也是刚好10字符长度
    if (!isNaN(time) && ('' + time).length === 10) time = parseInt(time) * 1000
    date = new Date(time)
    if (isNaN(date.getTime())) {
      date = new Date(time.replace(/-/g, '/'))
    }
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

/**
 * 格式化时间，兼容IE chrome的日期格式 '{y}-{m}-{d} {h}:{i}:{s}'
 * @param {*} time 时间戳 或者 中文
 * @return Date
 */
export function createTime(time) {
  if (arguments.length === 0) {
    return null
  }
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    // 有种情况 2019-01-10 也是刚好10字符长度
    if (!isNaN(time) && ('' + time).length === 10) time = parseInt(time) * 1000
    date = new Date(time)
    if (isNaN(date.getTime())) {
      date = new Date(time.replace(/-/g, '/'))
    }
  }

  return date
}

export function formatTime(time, option) {
  time = +time * 1000
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) { // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分'
  }
}

// 格式化url后的查询数据、解析表单数据 返回Object
export function getQueryObject(url) {
  url = url == null ? window.location.href : url
  const search = url.substring(url.lastIndexOf('?') + 1)
  const obj = {}
  const reg = /([^?&=]+)=([^?&=]*)/g
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1)
    let val = decodeURIComponent($2)
    val = String(val)
    obj[name] = val
    return rs
  })
  return obj
}

/**
 *get getByteLen
 * @param {Sting} val input value
 * @returns {number} output value
 */
export function getByteLen(val) {
  let len = 0
  for (let i = 0; i < val.length; i++) {
    if (val[i].match(/[^\x00-\xff]/ig) != null) {
      len += 1
    } else { len += 0.5 }
  }
  return Math.floor(len)
}

/**
 * 清除数组中的无效元素
 * @param {Array} actual
 */
export function cleanArray(actual) {
  const newArray = []
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i])
    }
  }
  return newArray
}

export function param(json) {
  if (!json) return ''
  return cleanArray(Object.keys(json).map(key => {
    if (json[key] === undefined) return ''
    return encodeURIComponent(key) + '=' +
            encodeURIComponent(json[key])
  })).join('&')
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"')
        .replace(/\+/g, ' ') +
      '"}'
  )
}

/* format the val to htmlContent */
export function html2Text(val) {
  const div = document.createElement('div')
  div.innerHTML = val
  return div.textContent || div.innerText
}

export function objectMerge(target, source) {
  /* Merges two  objects,
     giving the last one precedence */

  if (typeof target !== 'object') {
    target = {}
  }
  if (Array.isArray(source)) {
    return source.slice()
  }
  Object.keys(source).forEach((property) => {
    const sourceProperty = source[property]
    if (typeof sourceProperty === 'object') {
      target[property] = objectMerge(target[property], sourceProperty)
    } else {
      target[property] = sourceProperty
    }
  })
  return target
}

export function scrollTo(element, to, duration) {
  if (duration <= 0) return
  const difference = to - element.scrollTop
  const perTick = difference / duration * 10
  setTimeout(() => {
    element.scrollTop = element.scrollTop + perTick
    if (element.scrollTop === to) return
    scrollTo(element, to, duration - 10)
  }, 10)
}

export function toggleClass(element, className) {
  if (!element || !className) {
    return
  }
  let classString = element.className
  const nameIndex = classString.indexOf(className)
  if (nameIndex === -1) {
    classString += '' + className
  } else {
    classString = classString.substr(0, nameIndex) + classString.substr(nameIndex + className.length)
  }
  element.className = classString
}

export const pickerOptions = [
  {
    text: '今天',
    onClick(picker) {
      const end = new Date()
      const start = new Date(new Date().toDateString())
      end.setTime(start.getTime())
      picker.$emit('pick', [start, end])
    }
  }, {
    text: '最近一周',
    onClick(picker) {
      const end = new Date(new Date().toDateString())
      const start = new Date()
      start.setTime(end.getTime() - 3600 * 1000 * 24 * 7)
      picker.$emit('pick', [start, end])
    }
  }, {
    text: '最近一个月',
    onClick(picker) {
      const end = new Date(new Date().toDateString())
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      picker.$emit('pick', [start, end])
    }
  }, {
    text: '最近三个月',
    onClick(picker) {
      const end = new Date(new Date().toDateString())
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      picker.$emit('pick', [start, end])
    }
  }
]

export const pickerOptions2 = {
  shortcuts: [{
    text: '最近一周',
    onClick(picker) {
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      picker.$emit('pick', start)
    }
  }, {
    text: '最近一个月',
    onClick(picker) {
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      picker.$emit('pick', start)
    }
  }, {
    text: '最近三个月',
    onClick(picker) {
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      picker.$emit('pick', start)
    }
  }]
}

/**
 * lodash/debounce 类似
 * @param {*} func
 * @param {*} wait
 * @param {*} immediate
 */
export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function() {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function(...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 */
export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'shallowClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach((keys) => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

/** real deepclone  */
export function deepClone2(source) {
  return JSON.parse(JSON.stringify(source))
}

/* based on es6, remove the duplicate part of array */
export function uniqueArr(arr) {
  return Array.from(new Set(arr))
}
/* 可以参考loadsh.uniq() */
export function uniqueArr2(arr) {
  var r = []
  for (var i = 0, l = arr.length; i < l; i++) {
    for (var j = i + 1; j < l; j++) {
      if (arr[i] === arr[j]) { j = ++i }
    }
    r.push(arr[i])
  }
  return r
}

/* Capitalize first letter */
export function CapitalizeFirstLetter(str) {
  return str.replace(/\b\w/g, (t) => { return t.toUpperCase() })
}
/* Capitalize first letter and lower case */
export function CapitalizeFirstLetter2(str) {
  return str.replace(/\b\w+\b/g, (word) => {
    const _lowerCaseWord = word.toLowerCase()
    return _lowerCaseWord.substring(0, 1).toUpperCase() + _lowerCaseWord.substring(1)
  })
}

export function getIEVersion() {
  const userAgent = navigator.userAgent // 取得浏览器的userAgent字符串
  const isIE = userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1 // 判断是否IE<11浏览器
  const isEdge = userAgent.indexOf('Edge') > -1 && !isIE // 判断是否IE的Edge浏览器
  const isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf('rv:11.0') > -1
  if (isIE) {
    const reIE = new RegExp('MSIE (\\d+\\.\\d+);')
    reIE.test(userAgent)
    const fIEVersion = parseFloat(RegExp['$1'])
    if (fIEVersion === 7) {
      console.log('IE7')
      return 7
    } else if (fIEVersion === 8) {
      console.log('IE8')
      return 8
    } else if (fIEVersion === 9) {
      console.log('IE9')
      return 9
    } else if (fIEVersion === 10) {
      console.log('IE01')
      return 10
    } else {
      console.log('IE6')
      return 6// IE版本<=7
    }
  } else if (isEdge) {
    console.log('edge') // edge
    return 'edge'
  } else if (isIE11) {
    console.log('IE11')
    return 11
  } else {
    console.log('不是ie浏览器')
    return -1
  }
}

export function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      resolve(img)
    }
    img.onerror = () => {
      reject(new Error('图片加载错误'))
    }
    img.src = url
  })
}

/**
 * 将图片base64数据导出为图片
 * @param {String} imgsrc
 * @param {String} fileName
 */
export function exportTOImage2(imgsrc, fileName) {
  var image = new Image()
  // 解决跨域 Canvas 污染问题
  image.setAttribute('crossOrigin', 'anonymous')
  image.onload = function() {
    var canvas = document.createElement('canvas')
    canvas.width = image.width
    canvas.height = image.height
    var context = canvas.getContext('2d')
    context.drawImage(image, 0, 0, image.width, image.height)
    var url = canvas.toDataURL('image/png') // 得到图片的base64编码数据

    var a = document.createElement('a') // 生成一个a元素
    var event = new MouseEvent('click') // 创建一个单击事件 IE下不支持此方法
    a.download = fileName || 'photo' // 设置图片名称
    a.href = url // 将生成的URL设置为a.href属性
    a.dispatchEvent(event) // 触发a的单击事件
  }
  image.src = imgsrc
}

/**
 * 将图片base64数据导出为图片 兼容IE 10+
 * @param {*} content
 * @param {*} fileName
 */
export function exportTOImage(content, fileName, suffix = 'jpg') {
  const base64ToBlob = function(code) {
    const parts = code.split(';base64,')
    const contentType = parts[0].split(':')[1]
    const raw = window.atob(parts[1])
    const rawLength = raw.length
    const uInt8Array = new Uint8Array(rawLength)
    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i)
    }
    return new Blob([uInt8Array], {
      type: contentType
    })
  }
  const blob = base64ToBlob(content) // new Blob([content]);
  const url = URL.createObjectURL(blob)
  if (getIEVersion() === -1) {
    const aLink = document.createElement('a')
    const evt = document.createEvent('HTMLEvents')
    evt.initEvent('click', true, true) // initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为
    aLink.download = fileName + '.' + suffix
    aLink.href = url
    aLink.click()
  } else {
    console.log('IE export image')
    window.navigator.msSaveOrOpenBlob(blob, fileName)
  }
}

/**
 * 导出文件工具方法
 * 需要将返回的文件流对象直接传入,
 * 如果没有数据， 返回一个对象
 * 文件命名规范为手动传入一个文件名，然后加上日期，时分秒
 */
export function exportFile(response, type = 'application/vnd.ms-excel') {
  var content = response.data
  const blob = new Blob([content], { type })

  const downloadUrl = window.URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  // const disposition = response.headers['content-disposition']
  // /(?<= filename=).+(?=\.[xls|xlsx|docx|])/
  // /(?<= filename=).+(xls|xlsx|doc|docx)\b/
  // const pattern = new RegExp('(?<= filename=).+(xls|xlsx|doc|docx)\\b')
  // const result = disposition.match(pattern)
  const fileName = content.type
  anchor.href = downloadUrl
  anchor.download = fileName
  anchor.click()
  window.URL.revokeObjectURL(blob)
}

