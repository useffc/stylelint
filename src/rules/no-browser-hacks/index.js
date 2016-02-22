import stylehacks from "stylehacks"
import Result from "postcss/lib/result"
import { isString, assign } from "lodash"
import {
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "no-browser-hacks"

export const messages = ruleMessages(ruleName, {
  rejected: (type, hack) => `Unexpected ${type} hack "${hack}"`,
})

export default function (on, options) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual: on }, {
      optional: true,
      actual: options,
      possible: {
        browsers: [isString],
      },
    })
    if (!validOptions) { return }

    const stylehacksOptions = assign({ lint: true }, options)

    const stylehacksResult = new Result()
    stylehacks(stylehacksOptions)(root, stylehacksResult)
    stylehacksResult.warnings().forEach(stylehacksWarning => {
      const parsedWarning = parseStylehacksWarning(stylehacksWarning.text)
      const message = messages.rejected(parsedWarning[0], parsedWarning[1])
      report({
        ruleName,
        result,
        message,
        node: stylehacksWarning.node,
        line: stylehacksWarning.line,
        column: stylehacksWarning.column,
      })
    })
  }
}

function parseStylehacksWarning(warningText) {
  return warningText.match(/^Bad (.+?): (.+)$/).slice(1)
}
