Ext.define('rewpos.view.ClienteBuscarModal', {
    extend: 'Ext.form.Panel',
    xtype: 'clienteBuscarModal',
    config: {
        centered: true,
        width: 700,
        height: 340, /*340*/
        hideOnMaskTap: true,
        modal: true,
        items: [{
            xtype: 'fieldset',
            items: [{
                xtype: 'searchfield',
                name: 'nombre',
                placeHolder: 'RUC/DNI/RAZON SOCIAL/NOMBRE'
            },{
                xtype: 'list',
                id: 'clientesList',
                store: 'Cliente',
                height: 265, /*202*/
                itemTpl: new Ext.XTemplate(
                    '<div class="-row-list">',
                        '<div class="field ruc">{ruc}</div>',
                        '<div class="field flex">{nombre}</div>',
                    '</div>'
                )
            }]
        }/*,{
            layout: 'hbox',
            defaults: {
                xtype: 'button',
                flex: 1
            },
            height: 65,
            items: [{
                text: 'Cancelar',
                itemId: 'cancelar',
                cls: 'btn_eliminar'
            },{
                text: 'Aceptar',
                itemId: 'aceptar',
                cls: 'btn_editar'
            }]
        }*/]
        
    }
});