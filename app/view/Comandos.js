Ext.define('rewpos.view.Comandos', {
	extend: 'Ext.Container',
    xtype: 'comandos',
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
            name: 'btnComandoBuscar',
            iconCls: 'ico_buscar'
            /*cls: 'btn_comando_buscar bordeado_c',
            pressedCls: 'btn_comando_buscar_pressed'*/
        },{
            name: 'btnComandoPrecuenta',
            iconCls: 'ico_precuenta'
        },{
            name: 'btnComandoEnviar',
            iconCls: 'ico_enviar'
            /*cls: 'btn_comando_codigo bordeado_c'*/
        },{
            name: 'btnComandoMas',
            iconCls: 'ico_mas'
            /*cls: 'btn_comando_mas bordeado_c'*/
        }]
    }
});