Ext.define('rewpos.view.Seleccion', {
	extend: 'Ext.Container',
    xtype: 'seleccion',
    config: {
    	layout: 'hbox',
        cls: 'background_seleccion',
        defaults: {
            xtype: 'button',
            cls: 'btn_seleccion'
        },
        items: [{
            name: 'btnSeleccionMesa',
            text: 'M: 0',
            width: 100
        },{
            name: 'cboPax',
            text: 'P: 1',
            value: 1,
            width: 100
        },{
            xtype: 'selectfield',
            name: 'cboMozos',
            flex: 1,
            baseCls: 'btn_seleccion_mozo'
        }]
    }
});