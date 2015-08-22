Ext.define('rewpos.view.configuracion.ConfiguracionList', {
	extend: 'Ext.dataview.List',
    xtype: 'configuracionList',
    //id: 'pedidoList',
    config: {
    	//store: 'Pedido',
    	itemTpl: new Ext.XTemplate(
	    	'<div class="-row-list">',
		    	'<div class="field">{cantidad}</div>',
	    	'</div>'
	    ),
        data: [
            {'id': 1, 'cantidad': 'EMPRESA'}, 
            {'id': 2, 'cantidad': 'IMPRESORAS'}, 
            {'id': 3, 'cantidad': 'PRODUCTOS'}
        ]
    }
});