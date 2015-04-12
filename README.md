# transform-arguments

This is useful for transforming a set of arguments to match what is expected
by another function.

## Install

```sh
npm install transform-arguments
```

## Usage

The transform function takes a spec to define how to transform the arguments.
It can also accept an optional handler to process the results before returning.
The optional handler can itself return a promise, so async processing is easy.

```js
let transformer = transform([{
  get: 'params.name'
}], (name) => {
  return `Hello, ${name}!`
})

app.get('/hello/:name', function (req, res) {
  transformer(req, res).then((msg) => {
    res.send(msg)
  })
})
```

Also, if you use an object rather than an array for the spec it will
transform to a single value rather than an array of values.

```js
let transformer = transform({
  get: 'params.name'
})

app.get('/hello/:name', function (req, res) {
  transformer(req, res).then((name) => {
    res.send(`Hello, ${name}!`)
  })
})
```

## Specs

### spec.from

This is the object to search in. Valid values are: "arguments", "args", "self",
"this" and 0 through whatever number of arguments get passed into the transform
function. By default, the value is 0, the first argument.

### spec.get

This is a value in dot notation, or array notation, describing how to locate
the expected value. Both 'params.name' and ['params','name'] will transform to
obj.params.name when locating the target object. When omitted, the `from`
target itself will be returned as the target value.

### spec.buffer

This allows you to concatenate a located stream into a buffer before returning.

---

### Copyright (c) 2015 Stephen Belanger
#### Licensed under MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
