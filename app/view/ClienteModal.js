Ext.define('rewpos.view.ClienteModal', {
    extend: 'Ext.form.Panel',
    xtype: 'clienteModal',
    config: {
        centered: true,
        width: 700,
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
                name: 'ruc',
                placeHolder: 'RUC/DNI'
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
            /*xtype: 'toolbar',
            docked: 'bottom',*/
            layout: 'hbox',
            defaults: {
                xtype: 'button',
                flex: 1
            },
            height: 55,
            items: [/*{
                xtype: 'label',
                html: 'Informacion de Cliente'
            },{
                xtype: 'spacer'
            },{
                text: 'Borrar',
                itemId: 'borrar'
            },*/{
                text: 'Cancelar',
                itemId: 'cancelar',
                cls: 'btn_eliminar'
            },{
                text: 'Aceptar',
                itemId: 'aceptar',
                cls: 'btn_editar'
            }]
        }]
        
    }
});