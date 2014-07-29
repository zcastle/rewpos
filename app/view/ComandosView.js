Ext.define('rewpos.view.ComandosView', {
	extend: 'Ext.Panel',
    xtype: 'comandosView',
    config: {
    	layout: 'hbox',
        cls: 'background_comando',
        height: 65,
        defaults: {
            xtype: 'button',
            cls: 'btn_accion',
            flex: 1
        },
        items: [{
            itemId: 'btnComandoBuscar',
            iconCls: 'ico_buscar'
        },{
            itemId: 'btnComandoPrecuenta',
            iconCls: 'ico_precuenta'
        },{
            itemId: 'btnComandoEnviar',
            iconCls: 'ico_enviar'
        },{
            itemId: 'btnComandoMas',
            iconCls: 'ico_mas'
        }]
    }
});