Ext.define('rewpos.view.Comandos', {
	extend: 'Ext.Container',
    xtype: 'comandos',
    config: {
    	layout: 'hbox',
        cls: 'background_comando',
        height: 65,
        defaults: {
            xtype: 'button',
            flex: 1
        },
        items: [{
            id: 'btnComandoBuscar',
            cls: 'btn_comando_buscar bordeado_c',
            pressedCls: 'btn_comando_buscar_pressed'
        },{
            id: 'btnComandoBuscarBarra',
            cls: 'btn_comando_codigo bordeado_c'
        },{
            id: 'btnComandoMas',
            cls: 'btn_comando_mas bordeado_c'
        }]
    }
});