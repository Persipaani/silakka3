import { random } from 'lodash'
import { randomString, createMessage } from '~/test/test-utils'
import start from '~/src/core'

describe('echo module', () => {
  let chatId
  let bot
  beforeEach(async () => {
    chatId = random(100)
    bot = await start()
  })

  it('responds with same message', async () => {
    const string = randomString(10)
    bot.emit('message', createMessage(`/echo ${string}`, chatId))

    expect(bot.sendMessage).toHaveBeenCalledTimes(1)
    expect(bot.sendMessage).toHaveBeenLastCalledWith(chatId, string)
  })
})
