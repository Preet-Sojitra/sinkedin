// convert the posts into tokens by the following strategies :
// - convert to lowercase
// - replace punctuations and non-alphabetical characters with spaces
// - concate the words sepaarted by spaces or . ; like A b u s E -> abuse
// - return the normalized text converted to tokens

const leetMap = {
  '@': 'a',
  $: 's',
  0: 'o',
  1: 'l',
  '!': 'i',
  3: 'e',
  7: 't',
}

export default function TokenizePosts(text) {
  let normalized_text = ''

  // replacing characters using leetMap and not alphabetical characters with ' '
  for (let i = 0; i < text.length; i++) {
    let ch = text[i].toLowerCase()
    if (ch != ' ' && (ch < 97 || ch > 122)) {
      ch = ''
    }
    normalized_text += leetMap[ch] || ch
  }

  // words separated by ' ', . or _ are concatanated per characters
  normalized_text = normalized_text.replace(
    /\b([a-z])(?:[\s._-]+([a-z]))+\b/g,
    (match) => match.replace(/[\s._-]+/g, ''),
  )

  // converting the posts into tokens
  let tokens = normalized_text.split(' ')
  tokens = tokens.filter((token) => token.trim().length != 0)

  return tokens
}
