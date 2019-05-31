import logger from '~/src/logger'

export default bot => {
  bot.onText(/\/echo (.+)/, (msg, match) => {
    const chatId = msg.chat.id
    const resp = match[1]

    logger.debug(`Echo message received: "${resp}"`)
    bot.sendMessage(chatId, resp)
  })

  logger.info('Echo module added')
}
