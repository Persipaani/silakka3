import logger from '~/src/logger'

export default bot => {
  bot.onText(/\/8ball (.+)/, (msg, match) => {
    const { chat } = msg
    const [, resp] = match

    logger.debug(`8Ball message received ${resp}`)
    bot.sendMessage(chat.id, resp)
  })
}
