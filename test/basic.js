import stream from 'through2'
import transform from '../'

describe('basics', () => {
  let inst

  it('should construct a single-value transformer', () => {
    inst = transform({ get: 'name' })
  })

  it('should search using the transformer', () => {
    return inst({ name: 'foo' }).then((name) => {
      name.should.equal('foo')
    })
  })

  it('should support multi-value transform', () => {
    let transformer = transform([
      { get: 'foo' },
      { get: 'baz' }
    ])

    return transformer({ foo: 'bar', baz: 'buz' }).then((args) => {
      args.should.have.lengthOf(2)
      args[0].should.equal('bar')
      args[1].should.equal('buz')
    })
  })

  it('should support finding "this" with "from" targetting', () => {
    let transformer = transform({
      from: 'this',
      get: 'foo'
    })

    return transformer.call({ foo: 'bar' }).then((foo) => {
      foo.should.equal('bar')
    })
  })

  it('should support finding numbered arguments with "from" targetting', () => {
    let transformer = transform({
      from: 1,
      get: 'foo'
    })

    return transformer(null, { foo: 'bar' }).then((foo) => {
      foo.should.equal('bar')
    })
  })

  it('should search with dot notation', () => {
    let spec = {
      get: 'foo.bar'
    }

    let req = {
      foo: {
        bar: 'baz'
      }
    }

    let transformer = transform(spec)
    return transformer(req).then((res) => {
      res.should.equal('baz')
    })
  })

  it('should search with array notation', () => {
    let spec = {
      get: ['foo','bar']
    }

    let req = {
      foo: {
        bar: 'baz'
      }
    }

    let transformer = transform(spec)
    return transformer(req).then((res) => {
      res.should.equal('baz')
    })
  })

  it('should support buffering streams', () => {
    let spec = {
      buffer: true
    }

    let req = stream()
    setTimeout(() => req.end('foo'), 10)

    let transformer = transform(spec)
    return transformer(req).then((res) => {
      res.should.be.an.instanceOf(Buffer)
      res.toString().should.equal('foo')
    })
  })

  it('should support handler function', () => {
    let transformer = transform({ get: 'name' }, (name) => {
      return `Hello, ${name}!`
    })

    return transformer({ name: 'world' }).then((msg) => {
      msg.should.equal('Hello, world!')
    })
  })

})
