// Stub for react-markdown in Jest (ESM-only package).
// Renders children as plain text so markdown content is still accessible.
const React = require("react");

function ReactMarkdown({ children, className }) {
  return React.createElement("div", { className }, children);
}

module.exports = ReactMarkdown;
module.exports.default = ReactMarkdown;
