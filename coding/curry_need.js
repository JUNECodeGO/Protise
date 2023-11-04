function curry(func) {
    let _arg = []
    return function _curry(...args) {
        _arg = _arg.concat(args)
        if (_arg.length >= func.length) {
            const res = func(..._arg)
            _arg = []
            return res
        } else {
            return _curry

        }
    }

}