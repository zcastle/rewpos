Ext.define('rewpos.view.DescuentoModal', {
    extend: 'Ext.form.Panel',
    xtype: 'descuentoModal',
    config: {
        centered: true,
        width: 400,
        height: 150,
        hideOnMaskTap: true,
        modal: true,
        items: [{
            xtype: 'fieldset',
            title: 'Ingrese el MONTO a Descontar',
            items: [{
                xtype: 'numberfield',
                minValue: 0,
                name: 'descuento'
            }]
        }]
    }
});