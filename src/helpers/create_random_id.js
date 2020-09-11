export function generateRandomID(slicefrom=null) {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    const random_string = (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
    if (slicefrom){
        return random_string.slice(0, slicefrom).replace(/-/g, '')
    }
    return random_string
}
