import { magenta, cyan } from 'chalk'
import { capitalize } from 'lodash'

import env from './config' // configure environment

import logger from './logger'

logger.info(
  magenta(() => {
    //
    //
    //   _____/\\\\\\\\\\\____/\\\\\\\\\\\__/\\\_________________/\\\\\\\\\_____/\\\________/\\\__/\\\________/\\\_____/\\\\\\\\\__________________/\\\\\\\\\\__
    //  ___/\\\/////////\\\_\/////\\\///__\/\\\_______________/\\\\\\\\\\\\\__\/\\\_____/\\\//__\/\\\_____/\\\//____/\\\\\\\\\\\\\______________/\\\///////\\\_
    //   __\//\\\______\///______\/\\\_____\/\\\______________/\\\/////////\\\_\/\\\__/\\\//_____\/\\\__/\\\//______/\\\/////////\\\____________\///______/\\\__
    //    ___\////\\\_____________\/\\\_____\/\\\_____________\/\\\_______\/\\\_\/\\\\\\//\\\_____\/\\\\\\//\\\_____\/\\\_______\/\\\___________________/\\\//___
    //     ______\////\\\__________\/\\\_____\/\\\_____________\/\\\\\\\\\\\\\\\_\/\\\//_\//\\\____\/\\\//_\//\\\____\/\\\\\\\\\\\\\\\__________________\////\\\__
    //      _________\////\\\_______\/\\\_____\/\\\_____________\/\\\/////////\\\_\/\\\____\//\\\___\/\\\____\//\\\___\/\\\/////////\\\_____________________\//\\\_
    //       __/\\\______\//\\\______\/\\\_____\/\\\_____________\/\\\_______\/\\\_\/\\\_____\//\\\__\/\\\_____\//\\\__\/\\\_______\/\\\____________/\\\______/\\\__
    //        _\///\\\\\\\\\\\/____/\\\\\\\\\\\_\/\\\\\\\\\\\\\\\_\/\\\_______\/\\\_\/\\\______\//\\\_\/\\\______\//\\\_\/\\\_______\/\\\___________\///\\\\\\\\\/___
    //         ___\///////////_____\///////////__\///////////////__\///________\///__\///________\///__\///________\///__\///________\///______________\/////////_____
  })
)

logger.info(
  cyan(() => {
    //
    //
    //                                                         |\    \ \ \ \ \ \ \      __
    //                                                         |  \    \ \ \ \ \ \ \   | O~-_
    //                                                         |   >----|-|-|-|-|-|-|--|  __/
    //                                                         |  /    / / / / / / /   |__\
    //                                                         |/     / / / / / / /
  })
)

logger.info(`Started in ${env.NODE_ENV} mode`)

export default who => `Hello ${capitalize(who)}!`
