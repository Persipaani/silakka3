import { take, chunk, sortBy, first } from 'lodash'
import logger from '~/src/logger'
import { get } from '~/src/query'
import { callbackData, callbackSplit } from '~/src/callbacks'

/**
 *
 * Module for searching Magic cards.
 *
 * Uses the Scryfall API <3
 *
 * @see https://api.scryfall.com
 *
 * Commands:
 *
 *     /magic <query>
 *
 * Examples:
 *
 *    /magic Man-o'-war
 *    /magic Murder color:b mana:{1}{B}{B}
 *    /magic oracle:scry type:artifact type:land
 *
 * @see https://scryfall.com/docs/syntax
 *
 * @author vjrasane
 */

const MODULE_ID = 'magic'
const API_URL = 'https://api.scryfall.com/cards'

/**
 * Telegram keyboard option for a given card
 *
 * @param {Card}
 *
 * @returns {Option}
 */
const option = ({ name, id }) => ({
  text: name,
  callback_data: callbackData(MODULE_ID, id)
})

/**
 * Telegram keyboard markup for given set of cards
 *
 * @param {array[Card]} cards
 *
 * @returns {Keyboard}
 */
const keyboard = cards => ({
  reply_markup: {
    inline_keyboard:
      // chunk cards to groups
      chunk(
        // take only shortest names
        take(
          // sort by name length
          sortBy(cards, ({ name }) => name.length),
          6
        ) // map to keyboard options
          .map(option),
        2
      )
  }
})

/**
 * Fetch card link for given card id
 *
 * @param {string} id
 *
 * @returns {string}
 */
const getCardImage = async id => {
  const { data } = await get(`${API_URL}/${id}`)
  // Data has either single image_uris-property or multiple card faces
  const imageUris = data.image_uris || first(data.card_faces).image_uris
  const imageUri = imageUris.normal
  logger.debug(`Retrieved magic card image: '${imageUri}'`)
  // The image link must have at least one space or Telegram does not render it.
  // Its there only for the image, the actual text link leads to Scryfall site.
  return `<a href="${imageUri}"> </a>
  <a href="${data.scryfall_uri}">${data.name}</a>`
}

/**
 * Command listener for magic card searches
 *
 * @param {Bot} bot
 *
 * @returns {void}
 */
const onCommand = bot =>
  bot.onText(/\/magic (.+)/, async (msg, match) => {
    const { chat } = msg
    try {
      const [, query] = match
      logger.debug(`Magic search received: "${query}"`)

      const { data } = await get(`${API_URL}/search`, {
        q: query,
        unique: 'cards'
      })

      if (data.total_cards === 1) {
        // Exactly one card, return image URL
        return bot.sendMessage(chat.id, await getCardImage(data.data[0].id), {
          parse_mode: 'HTML'
        })
      } else if (data.total_cards === 0) {
        // No matching cards (this shouldn't happen, we get 404 instead)
        return bot.sendMessage(chat.id, 'No matching cards!')
      }
      // More than one match, display keyboard with options
      return bot.sendMessage(
        chat.id,
        'More than one card found! Is it one of these?',
        keyboard(data.data)
      )
    } catch (err) {
      bot.sendMessage(chat.id, handleError(err))
    }
  })

/**
 * Keyboard response callback
 *
 * @param {Bot} bot
 *
 * @returns {void}
 */
const onCallback = bot =>
  bot.on('callback_query', async callback => {
    const { chat } = callback.message
    try {
      // Split callback data to moduleId and card id
      const [moduleId, cardId] = callbackSplit(callback.data)
      // Filter out callbacks from other modules
      if (moduleId === MODULE_ID) {
        logger.debug(`Magic callback received: "${cardId}"`)
        return bot.sendMessage(chat.id, await getCardImage(cardId), {
          parse_mode: 'HTML'
        })
      }
    } catch (err) {
      bot.sendMessage(chat.id, handleError(err))
    }
  })

/**
 * Handles errors thrown from command and callback handlers
 *
 * @param {Error} err
 *
 * @return {string}
 */
const handleError = err => {
  switch (err.response?.status) {
    case 400:
    case 404:
      logger.debug(`Magic search received response: ${err.response.status}`)
      // Query did not match any cards
      return 'No matching cards!'
  }

  logger.error(`Magic search failed: ${err.message}`)
  return "Oops! I'm out of mana, no magic today!"
}

/**
 * Initializes module with the given bot instance
 *
 * @param {Bot} bot
 *
 * @returns {void}
 */
export default bot => {
  onCommand(bot)
  onCallback(bot)
}

export { MODULE_ID }
