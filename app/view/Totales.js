Ext.define('rewpos.view.Totales', {
	extend: 'Ext.Container',
    xtype: 'totales',
    config: {
    	layout: 'hbox',
        items: [{
            xtype: 'label',
            id: 'lblTotalItems',
            cls: 'lbl_totales',
            flex: 1,
            html: 'TOTAL ITEMS: 0'
        }]
    }
});