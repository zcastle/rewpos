Ext.define('rewpos.view.ClienteModal', {
    extend: 'Ext.form.Panel',
    xtype: 'clienteModal',
    config: {
        centered: true,
        width: 500,
        height: 340,
        //hideOnMaskTap: true,
        modal: true,
        items: [{
            xtype: 'fieldset',
            //title: 'Informacion de Cliente',
            defaults: {
                xtype: 'textfield',
                labelWidth: 140
            },
            items: [{
                xtype: 'searchfield',
                label: 'RUC',
                name: 'ruc'
            },{
                label: 'Razon Social',
                name: 'nombre'
            },{
                xtype: 'textareafield',
                label: 'Direccion',
                maxRows: 4,
                name: 'direccion'
            },{
                xtype: 'selectfield',
                label: 'Distrito',
                name: 'ubigeo_id'
            }]
        },{
            xtype: 'toolbar',
            docked: 'bottom',
            items: [{
                xtype: 'label',
                html: 'Informacion de Cliente'
            },{
                xtype: 'spacer'
            },{
                text: 'Cancelar',
                action: 'cancelar'
            },{
                text: 'Aceptar',
                action: 'aceptar'
            }]
        }]
        
    }
});