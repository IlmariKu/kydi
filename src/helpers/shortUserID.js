export function cutShortUsername(username) {
  // For use in ChatDB, too long ID to write everywhere
  const SHORT_USER_ID_LIMIT = 8
  if (username) {
    return username.slice(0, SHORT_USER_ID_LIMIT);
  }
  return null
}
