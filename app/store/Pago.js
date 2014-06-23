Ext.define('rewpos.store.Pago', {
    extend: 'Ext.data.Store',
    config: {
        model: 'rewpos.model.Pago',
        sorters: [{
            property : "orden",
            direction: "ASC"
        }],
	    listeners: {
	    	load: function(store, records, successful, operation, eOpts) {
	    		this.getTotales();
	    	},
	    	addrecords: function(store, records, eOpts) {
	    		this.getTotales();
	    	},
	    	updaterecord: function(store, record, newIndex, oldIndex, modifiedFieldNames, modifiedValues, eOpts) {
	    		this.getTotales();
	    	},
	    	removerecords: function(store, records, indices, eOpts) {
	    		this.getTotales();
	    	}
	    }
    },
    getTotales: function() {
    	var totalIngresado = 0.0;
        var total = 0.0;
        var montoPagar = Ext.data.Types.NUMBER.convert(Ext.getCmp('lblTotalMonto').getText().substr(4));
    	this.each(function(item, index, length){
            //console.log(item.get('valorpago'));
            //if(!Ext.isNumber(item.get('valorpago'))) return;
            if(item.get('tipopago')=='PROPINA') return;
            //if(item.get('tipopago')=='DOLARES') {
            //    totalIngresado += item.get('valorpago') * rewpos.AppGlobals.TIPO_CAMBIO;
            //} else {
                totalIngresado += item.get('valorpago');
            //}
    	});
        total = montoPagar - totalIngresado;

        Ext.getCmp('lblTotalMontoIngresado').setHtml(rewpos.Util.toFixed(totalIngresado, 2));

        if(total<=0) {
            Ext.getCmp('lblTotalMontoRestante').setHtml('0.00');
            var vuelto = Math.abs(total);
            if(vuelto>0){
                Ext.getCmp('lblTotalMontoVuelto').setHtml(rewpos.Util.toFixed(vuelto, 2));
                Ext.getCmp('containerTotalMontoVuelto').setHidden(false);
            } else {
                Ext.getCmp('containerTotalMontoVuelto').setHidden(true);
            }
        } else {
            Ext.getCmp('lblTotalMontoRestante').setHtml(rewpos.Util.toFixed(total, 2));
            Ext.getCmp('containerTotalMontoVuelto').setHidden(true);
        }
    }
});