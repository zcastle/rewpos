Ext.define('rewpos.view.SeleccionView', {
	extend: 'Ext.Container',
    xtype: 'seleccionView',
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
            xtype: 'selectfield',
            name: 'cboPax',
            width: 100,
            baseCls: 'btn_seleccion'
        },{
            xtype: 'selectfield',
            name: 'cboMozos',
            flex: 1,
            baseCls: 'btn_seleccion'
        }]
    }
});