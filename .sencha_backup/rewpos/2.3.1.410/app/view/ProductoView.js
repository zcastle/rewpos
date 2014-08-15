Ext.define('rewpos.view.ProductoView', {
	extend: 'Ext.Container',
    xtype: 'productoView',
    config: {
        layout: 'hbox',
        items: [{
            flex: 2,
            xtype: 'container',
            layout: 'vbox',
            items: [{
                xtype: 'searchfield',
                placeHolder: 'Buscar...'
            },{
                xtype: 'productoList',
                flex: 1
            }]
        },{
            width: 5
        },{
            flex: 1,
            xtype: 'categoriaList'
        }]
    }
});