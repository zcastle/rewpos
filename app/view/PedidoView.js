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
                id: 'accion',
                xtype: 'accionesView'
            },{
                xtype: 'seleccion'
            },{
                flex: 1,
                xtype: 'pedidoList'
            },{
                xtype: 'totales'
            }]
        },{
            width: 5
        },{
            flex: 1,
            layout: 'vbox',
            items: [{
                xtype: 'comandos'
            },{
                id: 'comando',
                flex: 1,
                layout: 'card',
                animation:{type:'flip'},
                items: [{
                    xtype: 'buscarView'
                }, {
                    xtype: 'editarForm'
                }, {
                    xtype: 'pagosView'
                }]
            }]
        }]
    }
});