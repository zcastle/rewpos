Ext.define('rewpos.view.PedidoList', {
	extend: 'Ext.dataview.List',
    xtype: 'pedidoList',
    id: 'pedidoList',
    config: {
    	store: 'Pedido',
    	itemTpl: new Ext.XTemplate(
	    	'<div class="-row-list">',
                '<tpl if="this.isEnviado(enviado)">',
                    '<span class="field estado enviado"></span>',
                '<tpl else>',
                    '<span class="field estado noenviado"></span>',
                '</tpl>',
		    	'<div class="field flex">{producto_name:this.toUpper}</div>',
		    	'<div class="field cantidad">{cantidad}</div>',
		    	'<div class="field unitario">{precio:this.formatNumer}</div>',
		    	'<div class="field total">{[this.getTotal(values.cantidad, values.precio)]}</div>',
	    	'</div>',
	    	{
	            toUpper: function(item) {
	            	return item.toUpperCase();
        		},
        		formatNumer: function(item) {
        			return rewpos.Util.toFixed(item, 2);
        		},
        		getTotal: function(cantidad, precio) {
        			return rewpos.Util.toFixed(cantidad*precio, 2);
        		},
                isEnviado: function(enviado){
                   return enviado=='S';
                }
        	}
	    )
    }
});