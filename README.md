# dnode-p

Use promises in your [dnode](https://github.com/substack/dnode) remote interface.

### usage

Behaves just like dnode, but turns promises into callbacks under the hood.

```js
const dnode = require('dnode-p')

const server = dnode({
  double: async (number) => {
    return number * 2
  },
  explode: async () => {
    throw new Error('Kablaaaam!')
  }
})
server.listen(5004)
```

### credits

based on [dnode-promise](https://github.com/vespakoen/dnode-promise)