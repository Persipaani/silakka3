import TelegramServer from 'telegram-test-api'
import { randomString } from '~/test/test-utils'
import start from '~/src/core'

jest.unmock('node-telegram-bot-api')

describe('e2e', () => {
  const token = 'dummy-test-token'

  let server
  let client
  let bot

  beforeAll(async () => {
    server = new TelegramServer({ port: 9001 })
    await server.start()
    client = server.getClient(token, { timeout: 5000 })
    bot = await start({ polling: true, baseApiUrl: server.ApiURL }, token)
  })

  it('magic', async () => {
    await client.sendMessage(client.makeMessage('/magic manowar'))

    const { result } = await client.getUpdates()
    const [{ message }] = result
    expect(message.text).toContain("Man-o'-War")
  })

  it('echo', async () => {
    const string = randomString(10)
    await client.sendMessage(client.makeMessage(`/echo ${string}`))

    const { result } = await client.getUpdates()
    const [{ message }] = result
    expect(message.text).toEqual(string)
  })

  it('calc', async () => {
    await client.sendMessage(client.makeMessage(`/calc 1+1`))

    const { result } = await client.getUpdates()
    const [{ message }] = result
    expect(message.text).toEqual('2')
  })

  afterAll(async () => {
    await server.stop()
    bot.stopPolling()
  })
})
