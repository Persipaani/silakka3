import logger from '~/src/logger'
import { sample } from 'lodash'

/**
 * Module for magic 8 ball answers
 *
 * @author vjrasane
 */

const positiveAnswers = [
  'Tottakai!',
  'No totta vitussa!',
  'Tietysti!',
  'Todennäköisesti',
  'Olen siitä varma!',
  'Löisin siitä vetoa!',
  'Kyllä näin on!',
  'Kyllä vaan!',
  'Kyllä!',
  'Aivan varmasti!',
  'Epäilemättä'
]

const neutralAnswers = [
  'Mahdollisesti',
  'En osaa sanoa',
  'Ehkä',
  'Kukaan ei tiedä',
  'En tiedä',
  'Tuohon en voi vastata'
]

const negativeAnswers = [
  'Ei ikinä!',
  'No ei vitussa!',
  'Ei varmasti!',
  'En usko!',
  'Todennäköisesti ei',
  'En luottaisi siihen'
]

/**
 * Randomizes an magic 8 ball answer
 *
 * @returns {string}
 */
const getAnswer = () =>
  // sample from the selected list
  sample(
    // select one of the three lists at random
    sample([positiveAnswers, neutralAnswers, negativeAnswers])
  )

/**
 * Initializes module with the given bot
 *
 * @param {Bot} bot
 *
 * @returns {void}
 */
export default bot => {
  /**
   * Handler for magic 8 ball com*mands:
   *
   *      /8ball <question>
   */
  bot.onText(/\/8ball (.+)/, (msg, match) => {
    const { chat } = msg
    const [, resp] = match

    logger.debug(`8Ball message received ${resp}`)
    bot.sendMessage(chat.id, getAnswer())
  })
}
