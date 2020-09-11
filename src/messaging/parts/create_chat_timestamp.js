export function createTimestamp(time) {
    var timestamp = Date.parse(time)
    var date;
    if (isNaN(timestamp) === false){
        date = new Date(timestamp)
    }
    if (!date){
        return time
    }
    const minutes =
      date.getMinutes() < 10 ? `0${date.getMinutes()}` : `${date.getMinutes()}`;
    return `${date.getHours()}:${minutes}`;
  }
