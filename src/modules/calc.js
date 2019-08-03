import { eval as evaluate } from 'mathjs'
import logger from '~/src/logger'

/**
 *
 * Module for evaluating arithmetic expressions
 *
 * Uses mathjs library <3
 *
 * @see https://mathjs.org/
 *
 * Commands:
 *
 *      /calc <expression>
 *
 *  Examples:
 *
 *      /calc 1+1
 *      /calc 3! > 3^3
 *      /calc log (2) * sqrt(5)
 *      /calc det([-1, 2; 3, 1])
 *
 * @author vjrasane
 */

/**
 * Command listener for arithmetic evaluation
 *
 * @param {Bot} bot
 *
 * @returns {void}
 */
const onCommand = bot =>
  bot.onText(/\/calc (.+)/, async (msg, match) => {
    const { chat } = msg
    try {
      const [, expr] = match
      logger.debug(`Calc expression received: "${expr}"`)
      return bot.sendMessage(chat.id, evaluate(expr))
    } catch (err) {
      bot.sendMessage(chat.id, "You crazy! I can't do that!")
    }
  })

/**
 * Initializes module with the given bot instance
 *
 * @param {Bot} bot
 *
 * @returns {void}
 */
export default bot => {
  onCommand(bot)
}
