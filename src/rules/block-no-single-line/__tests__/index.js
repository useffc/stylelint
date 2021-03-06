import {
  ruleTester,
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule(undefined, tr => {
  tr.ok("")
  tr.ok("@import \"foo.css\";")

  tr.ok(
    "a {\ncolor: pink; }",
    "multi-line declaration block with newline at start"
  )
  tr.ok(
    "a {\r\ncolor: pink; }",
    "multi-line declaration block with CRLF at start"
  )
  tr.ok(
    "a { color: pink;\n}",
    "multi-line declaration block with newline at end"
  )
  tr.ok(
    "a { color: pink;\r\n}",
    "multi-line declaration block with CRLF at end"
  )
  tr.ok(
    "a { color: pink;\nbackground: orange; }",
    "multi-line declaration block with newline in middle"
  )
  tr.ok(
    "a { color: pink;\r\nbackground: orange; }",
    "multi-line declaration block with CRLF in middle"
  )
  tr.ok(
    "@media (color) {\na { color: pink;\r\nbackground: orange; }\n}",
    "multi-line blocks"
  )
  tr.ok(
    "a {\n@media (color) { color: pink;\r\nbackground: orange; }\n}",
    "multi-line blocks with the at-rule nested"
  )

  tr.notOk(
    "a { color: pink; }", {
      message: messages.rejected,
      line: 1,
      column: 3,
    }
  )
  tr.notOk(
    "a { color: pink; top: 1px; }", {
      message: messages.rejected,
      line: 1,
      column: 3,
    }, "single-line rule with two declarations"
  )
  tr.notOk(
    "a,\nb { color: pink; }", {
      message: messages.rejected,
      line: 2,
      column: 3,
    }, "multi-line rule with single-line declaration block"
  )
  tr.notOk(
    "@media print {\na { color: pink; }}", {
      message: messages.rejected,
      line: 2,
      column: 3,
    }, "single-line rule within multi-line at-rule"
  )
  tr.notOk(
    "@media print {\r\na { color: pink; }}", {
      message: messages.rejected,
      line: 2,
      column: 3,
    }, "single-line rule within multi-line at-rule and CRLF"
  )
  tr.notOk(
    "a {\r\n@media print { color: pink; }}", {
      message: messages.rejected,
      line: 2,
      column: 14,
    }, "single-line at-rule within multi-line rule and CRLF"
  )
  tr.notOk(
    "@rule { a:b }", {
      message: messages.rejected,
      line: 1,
      column: 7,
    }, "single-line @rule"
  )
})
