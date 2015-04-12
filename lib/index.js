import concat from 'concat-stream'
import Promise from 'bluebird'

export default function (specs, handler) {
  //
  // Normalize specs
  //
  if (Array.isArray(specs)) {
    specs.forEach(normalize)
  } else {
    normalize(specs)
  }

  //
  // Locate args based on spec expectations
  //
  return function () {
    // Expand arguments with some extra useful stuff
    let froms = arguments
    froms.arguments = froms
    froms.args = froms
    froms.this = this
    froms.self = this

    let transform = (spec) => {
      return new Promise((resolve) => {
        let value = froms[spec.from]

        // Handle property searching
        if (spec.get) {
          value = search(value, spec.get)
        }

        // Handle buffering of streams
        if (spec.buffer && typeof value.pipe === 'function') {
          value.pipe(concat(resolve))
        } else {
          resolve(value)
        }
      })
    }

    // Resolve each argument as a promise, so we can buffer streams
    var p = Array.isArray(specs)
      ? Promise.all(specs.map(transform))
      : transform(specs)

    // Run handler on result, if available
    if (typeof handler === 'function') {
      p = p.then(handler)
    }

    return p
  }
}

//
// Normalize a spec
//
function normalize (spec) {
  // Assume we're searching for the first argument by default
  spec.from = spec.from || 0

  // Support dot notation
  if (typeof spec.get === 'string') {
    spec.get = spec.get.split('.')
  }

  // Throw if the get spec is invalid
  if (spec.get && ! Array.isArray(spec.get)) {
    throw new Error('unrecognized get spec')
  }

  // Transform all-numeric strings to real numbers
  if (spec.get) {
    spec.get = spec.get.map(maybeNumber)
  }
}

//
// Detect if a given string is all numeric and maybe parse as number
//
let isNumeric = /^[0-9]$/
function maybeNumber (key) {
  return isNumeric.test(key) ? parseInt(key, 10) : key
}

//
// Attempt to get a property of an object,
// or throw rather than returning undefined
//
function get (from, prop) {
  let v = from[prop]
  if (typeof v === 'undefined') {
    throw new Error('Could not find ' + prop)
  }
  return v
}

//
// Search an object recursively based on a get spec
//
function search (from, to) {
  if (to.length > 1) {
    return search(get(from, to[0]), to.slice(1))
  }

  return get(from, to[0])
}
