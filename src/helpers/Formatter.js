const numeral = require('numeral');
numeral.register('locale', 'idr', {
  delimiters: {
      thousands: '.',
      decimal: ' '
  },
  abbreviations: {
      thousand: 'k',
      million: 'm',
      billion: 'b',
      trillion: 't'
  },
  ordinal : function (number) {
      return number === 1 ? 'er' : 'ème';
  },
  currency: {
      symbol: 'Rp'
  }
});
numeral.locale('idr');

export default class Formatter{
    static money(number, format='$ 0,0'){
        return numeral(number).format(format)
    }
    static number(number, format='0,0'){
        return numeral(number).format(format)
    }
    static date(date){
        // return moment(date);
    }
    static api_base_url(){
        let base_url = process.env.REACT_APP_API
        if(!base_url){
            const {hostname, protocol, port} = window.location;
            base_url = `${protocol}//${hostname}:${port}/api`;
        }
        return base_url;
    }
    static api_images(){
		// eslint-disable-next-line
        const {hostname, protocol, port} = window.location
        const base_url = `${protocol}//${hostname}`;
        return base_url;
    }
    static array_sort(property){
        var sortOrder = 1;
        if(property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        }
        return function (a,b) {
            /* next line works with strings and numbers, 
            * and you may want to customize it to your needs
            */
            var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
            return result * sortOrder;
        }
    }
}