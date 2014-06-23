Ext.define('rewpos.view.BuscarView', {
	extend: 'Ext.Container',
    xtype: 'buscarView',
    config: {
        layout: 'hbox',
        items: [{
            flex: 2,
            xtype: 'productoList'
        },{
            width: 5
        },{
            flex: 1,
            xtype: 'categoriaList'
        }]
    }
});