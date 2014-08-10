Ext.define('rewpos.view.PedidoView', {
	extend: 'Ext.Container',
    xtype: 'pedidoView',
    config: {
        id: 'cambio',
        layout: 'hbox',
        items: [{
            flex: 1,
            layout: 'vbox',
            items: [{
                xtype: 'seleccionView'
            },{
                flex: 1,
                xtype: 'pedidoList'
            },{
                xtype: 'totales'
            }]
        },{
            flex: 1,
            layout: 'vbox',
            items: [{
                xtype: 'comandosView'
            },{
                id: 'comandoCard',
                flex: 1,
                layout: 'card',
                animation:{
                    type: 'flip'
                },
                items: [{
                    xtype: 'productoTouchView'
                },{
                    xtype: 'editarForm',
                    scrollable: false,
                    height: '100%'
                },{
                    xtype: 'pagosView'
                }]
            }]
        }]
    }
});