import logger from '~/src/logger'
import { get } from '~/src/query'
import { parse } from 'node-html-parser'

var cache = null // this is the cache
var timeStamp = new Date()

/**
 *
 * Module for searching Ampparit for funny news
 * Takes an optional parameter (numer 1-10) for amount of articles to return
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
  bot.onText(/\/funnynews (.+)/, async (msg, match) => {
    const chatId = msg.chat.id

    logger.debug(match[1])

    if (match.length <= 2) {
      try {
        var now = new Date()
        if (now.getTime() - timeStamp.getTime() >= 300000 || cache == null) {
          logger.debug('Fetching data: ' + (now.getTime() - timeStamp.getTime()))
          cache = await queryNews()
          timeStamp = new Date()
        } else {
          logger.debug('Using old cached data: ' + (now.getTime() - timeStamp.getTime()))
        }

        var funnies = ''
        var beginning = 'No'
        var end = 'Data'
        for (var i = 0; i < parseInt(match[1], 10); i++) {
          beginning = cache[0][Math.floor(Math.random() * cache[0].length)]
          end = cache[1][Math.floor(Math.random() * cache[1].length)]
          funnies += beginning + ' \u2013 ' + end + '\n' + '~~~~~~~~~~~~~~~~~' + '\n'
        }

        if (funnies !== '') {
          bot.sendMessage(chatId, funnies)
        } else {
          bot.sendMessage(chatId, 'ERROR! No data to send...')
        }
      } catch (error) {
        logger.error(error)
        bot.sendMessage(chatId, 'Sorry, error...')
      }
    } else {
      bot.sendMessage(chatId, 'Invalid entry, RTFM...')
    }
  })

  logger.info(`ampparit module added`)
}

const getRaw = async videoQuery => {
  try {
    return await get('https://www.ampparit.com/suosituimmat')
  } catch (error) {
    logger.error(error)
  }
}

const queryNews = async newsQuery => {
  var results = '<html> <p>Hello</p></html>'
  results = await getRaw()
  const parsed = await parse(results.data)
  const titleLinkList = parsed.firstChild.querySelectorAll('a.news-item-headline')
  return headlines(titleLinkList)
}

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
