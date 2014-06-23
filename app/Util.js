Ext.define('rewpos.Util', {
    singleton: true,
    currencyPrecision: 2,
    currencySign: 'S/.',
    currencyAtEnd: false,
    decimalSeparator: '.',
    thousandSeparator: ',',
 
    formatCurrency: function (v, currencySign, decimals, end) {
        var negativeSign = '',
            format = ",0",
            i = 0;
        v = v - 0;

        if (v < 0) {
            v = -v;
            negativeSign = '-';
        }
 
        decimals = Ext.isDefined(decimals) ? decimals : rewpos.Util.currencyPrecision;
 
        format += format + (decimals > 0 ? '.' : '');
        for (; i < decimals; i++) {
            format += '0';
        }
 
        v = rewpos.Util.formatValue(v);
 
        if ((end || rewpos.Util.currencyAtEnd) === true) {
            return Ext.String.format("{0}{1}{2}", negativeSign, v, currencySign || rewpos.Util.currencySign);
        } else {
            return Ext.String.format("{0}{1}{2}", negativeSign, currencySign || rewpos.Util.currencySign, v);
        }
    },
 
    formatValue: function (nVal) {
        nVal += '';
        x = nVal.split(rewpos.Util.decimalSeparator);
        x1 = x[0];
        x2 = x.length > 1 ? rewpos.Util.decimalSeparator + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
 
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + rewpos.Util.thousandSeparator + '$2');
        }
        return x1 + x2;
    },
    toFixed: function(value, precision) {
        //if (isToFixedBroken) {
            precision = precision || 0;
            var pow = Math.pow(10, precision);
            return (Math.round(value * pow) / pow).toFixed(precision);
        //}

        //return value.toFixed(precision);
    }
});