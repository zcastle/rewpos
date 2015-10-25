Ext.define('rewpos.view.TecladoFull', {
	extend: 'Ext.form.Panel',
    xtype: 'tecladoFull',
    id: 'tecladoFull',
    config: {
        items: [{
            xtype: 'fieldset',
            items: [{
                xtype: 'textfield',
                name: 'producto_name',
                component: {
                    disabled: true
                }
            },{
                xtype: 'container',
                layout: 'hbox',
                items: [{
                    xtype: 'textfield',
                    name: 'texto',
                    flex: 1
                },{
                    xtype: 'button',
                    text: 'ENTER',
                    cls: 'btn_editar'
                }]
            }]
        }]
    }
});