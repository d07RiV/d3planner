function isPlainObject(obj) {
  if (!obj || Object.prototype.toString.call(obj) !== "[object Object]") {
    return false;
  }
  const proto = Object.getPrototypeOf(obj);
  if (!proto) return true;
  const ctor = Object.prototype.hasOwnProperty.call(proto, "constructor") && proto.constructor;
  return typeof ctor === "function" && Function.prototype.toString.call(ctor) === Object.toString();
}
function iota(size) {
  return [...Array(size).keys()];
}

export { isPlainObject, iota };
