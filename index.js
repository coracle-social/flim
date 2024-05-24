const {DVM, withExpiration} = require('nikabrik')
const {now} = require('@coracle.social/lib')
const {createEvent} = require('@coracle.social/util')
const {subscribe} = require('@coracle.social/network')

require('dotenv').config()

const tags = []

const sub = subscribe({
  timeout: 30_000,
  relays: ["wss://relay.wavlake.com"],
  filters: [{
    kinds: [31337],
    '#p': ['8806372af51515bf4aef807291b96487ea1826c966a5596bca86697b5d8b23bc'],
  }],
})

sub.emitter.on('event', (url, e) => tags.push(["e", e.id, url]))

const startDVM = () =>
  new DVM({
    sk: process.env.DVM_SK,
    relays: [
      'wss://nostrainsley.coracle.tools',
      'wss://phantom-power.coracle.tools',
      'wss://relay.damus.io',
    ],
    strict: true,
    agents: {
      5300: dvm => ({
        handleEvent: async function* (event) {
          console.log(event)
          yield createEvent(event.kind + 1000, {
            tags: withExpiration(tags),
          })
        },
      }),
    }
  })

// Main

startDVM()

console.log("Worker started")
