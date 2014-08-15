Ext.define('rewpos.view.TecladoPrecioModal', {
    extend: 'Ext.Panel',
    xtype: 'tecladoPrecioModal',
    config: {
        cls: 'modal',
        centered: true,
        width: 500,
        hideOnMaskTap: true,
        modal: true,
        items: [{
            xtype: 'label',
            html: 'Cambiar Precio',
            cls: 'titulo-modal'
        },{
            xtype: 'fieldset',
            defaults: {
                xtype: 'textfield',
                labelWidth: 150
            },
            items: [{
                label: 'Producto',
                name: 'producto',
                readOnly: true
            },{
                label: 'Precio',
                name: 'precioOld',
                readOnly: true
            },{
                label: 'Nuevo Precio',
                name: 'precioNew',
                readOnly: true
            }]
        },{
            xtype: 'tecladoMoneda'
        }]
    }
});