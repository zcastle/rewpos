Ext.define('rewpos.view.SeleccionView', {
	extend: 'Ext.Panel',
    xtype: 'seleccionView',
    config: {
    	layout: 'hbox',
        cls: 'background_seleccion',
        defaults: {
            xtype: 'button'
        },
        items: [{
            name: 'btnSeleccionMesa',
            itemId: 'btnSeleccionMesa',
            text: 'M: 0',
            cls: 'btn_seleccion'
        },{
            xtype: 'selectfield',
            name: 'cboPax',
            width: 120,
            baseCls: 'btn_seleccion'
        },{
            xtype: 'selectfield',
            name: 'cboMozos',
            flex: 1,
            baseCls: 'btn_seleccion'
        },{
            name: 'lblTotalMonto',
            itemId: 'lblTotalMonto',
            text: rewpos.AppGlobals.MONEDA_SIMBOLO+'0.00',
            cls: 'btn_accion_pagar',
            pressedCls: 'btn_accion_pagar_pressed'
        }]
    }
});