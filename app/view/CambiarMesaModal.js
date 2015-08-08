Ext.define('rewpos.view.CambiarMesaModal', {
    extend: 'Ext.Panel',
    xtype: 'cambiarMesaModal',
    config: {
        cls: 'modal',
        centered: true,
        width: 500,
        hideOnMaskTap: true,
        modal: true,
        items: [{
            xtype: 'label',
            name: 'titulo',
            html: 'Cambiar Mesa',
            cls: 'titulo-modal'
        },{
            xtype: 'fieldset',
            defaults: {
                xtype: 'numberfield',
                labelWidth: 120
            },
            items: [{
                label: 'Mesa Origen',
                name: 'mesaOrigen',
                readOnly: true
            },{
                label: 'Mesa Destino',
                name: 'mesaDestino',
                readOnly: true
            }]
        },{
            xtype: 'tecladoNumerico'
        }]
    }
});