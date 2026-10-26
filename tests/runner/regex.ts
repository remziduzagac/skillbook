// Cases inherited Python's regular expressions. Translate its inline flags and named groups.
export function regex(pattern: string, insensitive = true): RegExp {
  let flags = insensitive ? "i" : "";
  pattern = pattern.replace(/\(\?([ims]+)\)/g, (_, f: string) => {
    for (const c of f) if (!flags.includes(c)) flags += c;
    return "";
  });
  pattern = pattern.replace(/\\A/g, "(?<![\\s\\S])").replace(/\\Z/g, "(?![\\s\\S])");
  pattern = pattern.replace(/\(\?P<([^>]+)>/g, "(?<$1>");
  return new RegExp(pattern, flags);
}
export const matches = (p: string, s: string) => regex(p).test(s);
