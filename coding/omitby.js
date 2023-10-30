function _omit(obj, array) {
    if (!Array.isArray(array)) {
        throw Error()
    }
    const res = {}
    for (let key in obj) {
        if (!obj.hasOwnProperty(key) || array.includes(key)) continue
        res[key] = obj[key]
    }
    return res

}

function _omitBy(obj, fn) {
    return Object.keys(obj).reduce((a, b) => {
        if (!fn(obj[b])) { a[b] = obj[b] }
        return a
    }, {})

}