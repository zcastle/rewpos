Ext.define('rewpos.view.configuracion.ConfiguracionView', {
	extend: 'Ext.Container',
    xtype: 'configuracionView',
    config: {
        layout: 'hbox',
        items: [{
            flex: 1,
            xtype: 'configuracionList'
        },{
            id: 'configuracionCard',
            flex: 3,
            layout: 'card',
            animation: {
                type: 'flip'
            },
            items: [{
                xtype: 'panel'
            },{
                xtype: 'mantenimientoProductoList'
            }]
        }]
    }
});