import logger from '~/src/logger'
import { get } from '~/src/query'

/**
 *
 * Module for searching Youtube videos
 * Will return only the top match for the best usability
 *
 * Commands:
 *
 *     /tube <query>
 *
 * Examples:
 *
 *    /tube Never going to give
 *
 *
 * @author sampo
 */

export default bot => {
  bot.onText(/\/tube (.+)/, async (msg, match) => {
    const chatId = msg.chat.id
    const videoQuery = match[1]

    try {
      const resultData = await queryVideos(videoQuery)
      bot.sendMessage(chatId, resultData)
    } catch (error) {
      logger.error(error)
      bot.sendMessage(chatId, 'Sorry, error...')
    }
  })
}

const getRaw = async videoQuery => {
  try {
    return await get('http://www.youtube.com/results', {
      search_query: videoQuery
    })
  } catch (error) {
    logger.error(error)
  }
}

const queryVideos = async videoQuery => {
  const results = await getRaw(videoQuery)

  if (results.data) {
    const regExp = /href="\/watch\?v=(.{11})/
    const parsed =
      'http://www.youtube.com/watch?v=' + regExp.exec(results.data)[1]
    return parsed
  } else {
    logger.error('Youtube search returned no data')
    return 'I did not find your video. :('
  }
}
