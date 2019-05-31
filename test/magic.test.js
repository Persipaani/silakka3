import { random } from 'lodash'
import { createMessage, createCallback } from '~/test/test-utils'
import { CALLBACK_MODULE_SEPARATOR } from '~/src/constants'
import { MODULE_ID } from '~/src/modules/magic'
import start from '~/src/core'

describe('magic module', () => {
  let chatId
  let bot
  beforeEach(async () => {
    chatId = random(100)
    bot = await start()
  })

  it("finds Man-o'-War", async () => {
    await bot.emit('message', createMessage('/magic manowar', chatId))

    expect(bot.sendMessage).toHaveBeenCalledTimes(1)
    const [[id, html]] = bot.sendMessage.mock.calls
    expect(html).toContain("Man-o'-War")
    expect(id).toEqual(chatId)
  })

  it('finds Murder', async () => {
    await bot.emit(
      'message',
      createMessage('/magic Murder color:b mana:{1}{B}{B}', chatId)
    )

    expect(bot.sendMessage).toHaveBeenCalledTimes(1)
    const [[id, html]] = bot.sendMessage.mock.calls
    expect(html).toContain('Murder')
    expect(id).toEqual(chatId)
  })

  it('finds Treasure Map', async () => {
    await bot.emit(
      'message',
      createMessage('/magic oracle:scry type:artifact type:land', chatId)
    )

    expect(bot.sendMessage).toHaveBeenCalledTimes(1)
    const [[id, html]] = bot.sendMessage.mock.calls
    expect(html).toContain('Treasure Map // Treasure Cove')
    expect(id).toEqual(chatId)
  })

  it('finds no cards for yolo swag', async () => {
    await bot.emit('message', createMessage('/magic yolo swag', chatId))

    expect(bot.sendMessage).toHaveBeenCalledTimes(1)
    const [[id, response]] = bot.sendMessage.mock.calls
    expect(response).toEqual('No matching cards!')
    expect(id).toEqual(chatId)
  })

  it('finds multiple cards for Wrath', async () => {
    await bot.emit('message', createMessage('/magic Wrath', chatId))

    expect(bot.sendMessage).toHaveBeenCalledTimes(1)

    const [[id, response, reply]] = bot.sendMessage.mock.calls

    expect(response).toEqual('More than one card found! Is it one of these?')
    expect(id).toEqual(chatId)

    reply.reply_markup.inline_keyboard.forEach(row => {
      expect(row).toHaveLength(2)
      row.forEach(cell => {
        expect(cell.text).toContain('Wrath')
        expect(cell.callback_data).toContain(
          `${MODULE_ID}${CALLBACK_MODULE_SEPARATOR}`
        )
      })
    })
  })

  it('returns Wrath of God after keyboard callback', async () => {
    await bot.emit(
      'callback_query',
      createCallback('magic', '2d9b12cc-f616-4b52-91eb-a430e70f9251', chatId)
    )

    expect(bot.sendMessage).toHaveBeenCalledTimes(1)
    const [[id, html]] = bot.sendMessage.mock.calls
    expect(html).toContain('Wrath of God')
    expect(id).toEqual(chatId)
  })
})
