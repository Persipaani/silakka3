import TelegramBot from 'node-telegram-bot-api'
import { API_TOKEN } from '~/src/config'
import logger from '~/src/logger'
import modules from '~/src/modules'

/**
 * Starts the bot with given config and token, initializing
 * submodules.
 *
 * @see https://github.com/yagop/node-telegram-bot-api
 *
 * If no config is given, defaults to:
 *
 *    { polling: true }
 *
 * If no token is given, reads it from the environment variable:
 *
 *    TELEGRAM_API_TOKEN
 *
 * @param {Object} config
 * @param {string} token
 *
 * @returns {Bot}
 */
export default async (config = { polling: true }, token = API_TOKEN) => {
  const bot = new TelegramBot(token, config)

  bot.on('polling_error', error => {
    logger.error(`Polling error: ${error.message} - ${error.code}`)
  })

  logger.info(`Bot started`)

  await modules(bot) // init submodules

  return bot
}
