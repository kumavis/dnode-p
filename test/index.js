const test = require('tape')
const dnode = require('../')

test('basic', async (t) => {

  const hostInterface = {
    say: async (message) => {
      const reversed = message.split('').reverse().join('')
      return `you say "${message}", i say "${reversed}"`
    },
    explode: async () => {
      throw new Error('boom!')
    },
  }

  const { guest, remoteHost } = await setupTest({ hostInterface })

  // basic usage
  const response1 = await remoteHost.say('beep')
  t.equals(response1, `you say "beep", i say "peeb"`)
  const response2 = await remoteHost.say('boop')
  t.equals(response2, `you say "boop", i say "poob"`)

  // error handling
  try {
    await remoteHost.explode()
  } catch (err) {
    t.ok(err, 'threw error')
    t.ok(err.message.includes('boom!'), 'includes original error message')
    console.error(err)
  }

  // finish
  guest.end()
  t.end()

})


async function setupTest({ hostInterface, guestInterface }) {

  // host
  const host = dnode(hostInterface)

  // guest
  const guest = dnode(guestInterface)

  //
  // establish connection
  //

  const hostConnectionCompletion = new Promise((resolve) => {
    guest.once('remote', resolve)
  })
  const guestConnectionCompletion = new Promise((resolve) => {
    host.once('remote', resolve)
  })

  host.pipe(guest).pipe(host) 
  
  const remoteGuest = await guestConnectionCompletion
  const remoteHost = await hostConnectionCompletion

  return { guest, host, remoteGuest, remoteHost }
  
}
