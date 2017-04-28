// Naive stab at detecting if an object is an actual object or not
function isObject(value) {
  if (!value) {
    return false;
  }
  return typeof value === 'object';
}

/*
 * Converts an object literal into Form Data:
 *
 *   > serializeFormData({ a: { b: 1 }, c:123, d:'foo', e:[456,789]})
 *   a[b]=1&c=123&d=foo&e=456&e=789
 */
module.exports = function serializeFormData(
  obj,
  wrap = x => encodeURIComponent(x)
) {
  return Object.keys(obj)
    .reduce(
      (parts, key) => {
        if (Array.isArray(obj[key])) {
          obj[key].forEach(v => {
            parts.push(`${wrap(key)}=${encodeURIComponent(v)}`);
          });
          return parts;
        }
        if (isObject(obj[key])) {
          return parts.concat(
            serializeFormData(
              obj[key],
              x => `${wrap(key)}[${encodeURIComponent(x)}]`
            )
          );
        }
        parts.push(`${wrap(key)}=${obj[key]}`);
        return parts;
      },
      []
    )
    .join('&');
};
