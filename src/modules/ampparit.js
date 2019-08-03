import logger from '~/src/logger'
import { get } from '~/src/query'
import { parse } from 'node-html-parser'
import { sample } from 'lodash'

var cache = null // this is the cache
var timeStamp = new Date()
const maxResults = 5 // amount
const maxCache = 5 // minutes

/**
 *
 * Module for searching Ampparit for funny news
 * Takes an optional parameter (numer 1-5) for amount of articles to return
 * If no parameter is supplied 1 funny news is returned
 * Caches data so that html query is done only every 5 minutes
 *
 * Commands:
 *
 *     /funnynews <amount>
 *
 * Examples:
 *
 *    /funnynews
 *    /funnynews 3
 *
 * @author sampo
 */

export default bot => {
  bot.onText(/\/funnynews(\s.+)?/, async (msg, match) => {
    const chatId = msg.chat.id

    try {
      const amount = validateInput(match[1])
      // Check if cache available or has expired
      var now = new Date()
      if (now.getTime() - timeStamp.getTime() >= maxCache * 60 * 1000 || cache == null) { // min * s * ms
        logger.debug('Prev data: ' + timeStamp.getHours() + ':' + timeStamp.getMinutes() + ' -> Fetching new data!')
        timeStamp = new Date()
        cache = await queryNews()
      } else {
        logger.debug('Prev data: ' + timeStamp.getHours() + ':' + timeStamp.getMinutes() + ' -> Using cached data!')
      }

      // Create funny headings from the available data
      var funnies = ''
      var beginning = 'No'
      var end = 'Data'

      for (var i = 0; i < amount; i++) {
        beginning = sample(cache[0])
        end = sample(cache[1])
        if (amount === i + 1) {
          funnies += beginning + ' \u2013 ' + end + '\n'
        } else {
          funnies += beginning + ' \u2013 ' + end + '\n' + '~~~~~~~~~~~~~~~~~' + '\n'
        }
      }

      if (funnies !== '') {
        bot.sendMessage(chatId, funnies)
      } else {
        bot.sendMessage(chatId, 'ERROR! No data to send...')
      }
    } catch (error) {
      logger.error(error)
      bot.sendMessage(chatId, 'Sorry, there was an error...')
    }
  })
  logger.info(`Ampparit module added`)
}

/*
  Validate & parse input.
  input = a match list provided by the bot wrapper.
*/
const validateInput = input => {
  if (input !== undefined) {
    const matchThis = '^[1-' + maxResults + ']+$'
    const regex = new RegExp(matchThis, 'g')
    if (input.trim().match(regex)) {
      return parseInt(input.trim().charAt(0), 10)
    } else {
      logger.debug('Unsuitable parameter')
      return 1
    }
  } else {
    logger.debug('No parameter given')
    return 1
  }
}

/* Data GET */
const getRaw = async urlAddress => {
  try {
    return await get(urlAddress)
  } catch (error) {
    logger.error(error)
  }
}

/* Queries data and parses it */
const queryNews = async () => {
  const results = await getRaw('https://www.ampparit.com/suosituimmat')
  const parsed = await parse(results.data)
  const titleLinkList = parsed.firstChild.querySelectorAll('a.news-item-headline')
  return headlines(titleLinkList)
}

/* Converts parsed data to two lists: beginnings and ends */
const headlines = rawData => {
  var beginnings = []
  var ends = []
  var parts = []
  for (var i = 0; i < rawData.length; i++) {
    if (rawData[i].innerHTML.includes(' - ')) {
      parts = rawData[i].innerHTML.split(' - ')
      beginnings.push(parts[0])
      ends.push(parts[1])
    } else if (rawData[i].innerHTML.includes(': ')) {
      parts = rawData[i].innerHTML.split(': ')
      beginnings.push(parts[0])
      ends.push(parts[1])
    }
  }
  return [beginnings, ends]
}
