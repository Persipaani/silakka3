import logger from '~/src/logger'

export default bot => {
  bot.onText(/\/echo (.+)/, (msg, match) => {
    const { chat } = msg
    const [, resp] = match

    logger.debug(`Echo message received: "${resp}"`)
    bot.sendMessage(chat.id, resp)
  })
}
