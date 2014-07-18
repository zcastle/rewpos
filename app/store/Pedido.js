Ext.define('rewpos.store.Pedido', {
    extend: 'Ext.data.Store',
    config: {
        model: 'rewpos.model.Pedido',
	    listeners: {
	    	load: function(store, records, successful, operation, eOpts) {
	    		this.setHeader();
	    	},
	    	addrecords: function(store, records, eOpts) {
	    		this.setHeader();
	    	},
	    	updaterecord: function(store, record, newIndex, oldIndex, modifiedFieldNames, modifiedValues, eOpts) {
                //console.log('updaterecord');
	    		this.setHeader();
	    	},
	    	removerecords: function(store, records, indices, eOpts) {
	    		this.setHeader();
	    	}
	    }
    },
    setHeader: function() {
    	rewpos.app.getController('Pedido').getTotalesView().down('label[name=lblTotalItems]').setHtml('TOTAL ITEMS: '+this.getCount());
        rewpos.app.getController('Pedido').getSeleccionView().down('button[name=lblTotalMonto]').setText(rewpos.AppGlobals.MONEDA_SIMBOLO+rewpos.Util.toFixed(this.getTotales(), 2));
        rewpos.app.getController('Pedido').getPagosView().down('label[name=lblTotalMontoPagar]').setHtml(rewpos.Util.toFixed(this.getTotales(), 2));
    },
    getTotales: function() {
    	var total = 0.0;
    	this.each(function(item, index, length){
    		total += item.get('cantidad') * item.get('precio');
    	});
    	return total;
    }
});