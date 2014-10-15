Ext.define('rewpos.view.ConfigModal', {
    extend: 'Ext.form.Panel',
    xtype: 'configModal',
    config: {
        centered: true,
        width: 400,
        height: 210,
        hideOnMaskTap: false,
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
            },{
                xtype: 'textfield',
                label: 'PRINT SERVER',
                name: 'print_server'
            },{
                xtype: 'spinnerfield',
                label: 'PUERTO',
                name: 'print_port',
                minValue: 1,
                stepValue: 1
            }]
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