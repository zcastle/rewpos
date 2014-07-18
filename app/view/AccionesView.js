Ext.define('rewpos.view.AccionesView', {
	extend: 'Ext.Container',
    xtype: 'accionesView',
    config: {
    	layout: 'hbox',
        height: 65,
        defaults: {
            xtype: 'button',
            cls: 'btn_accion'
        },
        items: [{
            flex: 1,
            iconCls: 'ico_accion_resumen'
        },{
            name: 'lblPrecuenta',
            flex: 1,
            iconCls: 'ico_accion_precuenta'
        },{
            flex: 1,
            iconCls: 'ico_accion_enviar'
        }]
    }
});