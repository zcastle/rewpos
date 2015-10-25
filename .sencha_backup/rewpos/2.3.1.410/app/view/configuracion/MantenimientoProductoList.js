Ext.define('rewpos.view.configuracion.MantenimientoProductoList', {
	extend: 'Ext.dataview.List',
    xtype: 'mantenimientoProductoList',
    //id: 'pedidoList',
    config: {
    	//store: 'Pedido',
    	itemTpl: new Ext.XTemplate(
	    	'<div class="-row-list">',
                '<div class="field flex">{producto_name:this.toUpper}</div>',
                '<div class="field unitario">{precio:this.formatNumer}</div>',
                '<div class="field categoria">{categoria_name:this.toUpper}</div>',
	    	'</div>',
            {
                toUpper: function(item) {
                    return item.toUpperCase();
                },
                formatNumer: function(item) {
                    return rewpos.Util.toFixed(item, 2);
                }
            }
	    ),
        data: [
            {'codigo': '', 'producto_name': 'producto 01', 'precio': 10, 'categoria_name': 'categoria 01'}, 
            {'codigo': '', 'producto_name': 'producto 02', 'precio': 10, 'categoria_name': 'categoria 01'}, 
            {'codigo': '', 'producto_name': 'producto 03', 'precio': 10, 'categoria_name': 'categoria 01'}, 
        ]
    }
});