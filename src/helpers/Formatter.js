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
        var base_url = `${process.env.REACT_APP_API}`;
        if(process.env.NODE_ENV === "production"){
            const {hostname, protocol} = window.location
            base_url = `${protocol}//${hostname}`
        }
        return base_url;
    }
}