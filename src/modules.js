import logger from '~/src/logger'
import { readdirSync } from 'fs'
import { join, basename } from 'path'

/**
 * Finds all module files under 'modules' directory
 * and initializes each of them by passing the bot
 * instance to it.
 *
 * @param {Bot} bot
 *
 * @returns {void}
 */
export default async bot => {
  const moduleFiles = readdirSync(join(__dirname, 'modules'))
  await Promise.all(
    moduleFiles.map(async file => {
      const moduleName = basename(file, '.js')
      try {
        const mod = await import(`./modules/${moduleName}`)
        mod.default(bot)

        logger.info(`${moduleName} module loaded`)
      } catch (error) {
        logger.error(`${moduleName} module loading failed: ${error}`)
      }
    })
  )
}
