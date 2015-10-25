Ext.define('rewpos.view.ProductoTouchView', {
	extend: 'Ext.Container',
    xtype: 'productoTouchView',
    config: {
        layout: 'vbox',
        items: [{
            layout: 'hbox',
            items: [{
                xtype: 'searchfield',
                flex: 2,
                placeHolder: 'Buscar...'
            },{
                xtype: 'button',
                flex: 1,
                cls: 'optShowCategorias',
                text: 'CATEGORIAS'
            }]
        },{
            layout: 'card',
            id: 'productosCard',
            flex: 1,
            animation:{
                type: 'flip'
            },
            items: [{
                xtype: 'categoriaDataView'
            },{
                xtype: 'productoDataView'
            },{
                xtype: 'productoList'
            }]
        }]
    }
});