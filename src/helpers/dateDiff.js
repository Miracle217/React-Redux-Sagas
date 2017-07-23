// http://stackoverflow.com/a/3177838
export default (date) => {
  var seconds = Math.floor((new Date() - date) / 1000);
  var interval = Math.floor(seconds / 31536000);

  if (interval > 0) {
    return inflect(interval, 'year');
  }
  interval = Math.floor(seconds / 2592000);
  if (interval > 0) {
    return inflect(interval, 'month');
  }
  interval = Math.floor(seconds / 604800);
  if (interval > 0) {
    return inflect(interval, 'week');
  }
  interval = Math.floor(seconds / 86400);
  if (interval > 0) {
    return inflect(interval, 'day');
  }
  interval = Math.floor(seconds / 3600);
  if (interval > 0) {
    return inflect(interval, 'hour');
  }
  interval = Math.floor(seconds / 60);
  if (interval > 0) {
    return inflect(interval, 'minute');
  }
  return inflect(Math.floor(seconds), 'second');
};

function inflect (count, word) {
  if (count != 1) {
    word += 's';
  }
  return count + ' ' + word;
}
