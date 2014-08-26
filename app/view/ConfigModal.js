Ext.define('rewpos.view.ConfigModal', {
    extend: 'Ext.form.Panel',
    xtype: 'configModal',
    config: {
        centered: true,
        width: 450,
        height: 110,
        hideOnMaskTap: true,
        modal: true,
        items: [{
            xtype: 'fieldset',
            defaults: {
                labelWidth: 130
            },
            items: [{
                xtype: 'spinnerfield',
                label: 'ID CAJA',
                name: 'caja_id',
                minValue: 1,
                stepValue: 1
            }/*,{
                xtype: 'textfield',
                label: 'HOST SERVICE',
                name: 'host_service'
            }*/]
        },{
            xtype: 'toolbar',
            docked: 'bottom',
            items: [{
                xtype: 'spacer'
            },{
                text: 'Cancelar',
                action: 'cancelar'
            },{
                text: 'Aceptar y Recargar',
                action: 'aceptar'
            }]
        }]
        
    }
});