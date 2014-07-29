Ext.define('rewpos.view.EditarForm', {
	extend: 'Ext.form.Panel',
    xtype: 'editarForm',
    config: {
        items: [{
            xtype: 'fieldset',
            defaults: {
                xtype: 'textfield',
                labelWidth: 110
            },
            items: [{
                name: 'producto_name'
            },{
                xtype: 'spinnerfield',
                label: 'CANTIDAD',
                name: 'cantidad',
                minValue: 1,
                stepValue: 1,
                component: {
                    disabled: true
                }
            },{
                xtype: 'container', 
                layout: 'hbox', 
                items: [{
                    xtype: 'spinnerfield',
                    name: 'precio',
                    minValue: 0.1,
                    stepValue: 0.5,
                    labelWidth: 110,
                    label: 'PRECIO', 
                    flex: 1,
                    component: {
                        disabled: true
                    }
                }, {
                    xtype: 'button',
                    name: 'btnTecladoCantidad',
                    iconCls: 'ico_teclado'
                }]
            },{
                xtype: 'textareafield',
                name: 'mensaje',
                placeHolder: 'MENSAJE'
            }]
        },{
            layout: {
                type: 'hbox'
            },
            defaults: {
                xtype: 'button',
                flex: 1
            },
            height: 65,
            items: [{
                name: 'btnEditar',
                iconCls: 'ico_editar',
                cls: 'btn_editar'
            },{
                name: 'btnEliminar',
                iconCls: 'ico_eliminar',
                cls: 'btn_eliminar'
            }]
        }]
    }
});