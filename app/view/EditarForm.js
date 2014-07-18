Ext.define('rewpos.view.EditarForm', {
	extend: 'Ext.form.Panel',
    xtype: 'editarForm',
    config: {
        items: [{
            xtype: 'fieldset',
            //title: 'Edicion de producto',
            defaults: {
                xtype: 'textfield',
                labelWidth: 110
            },
            items: [{
                //label: 'NOMBRE',
                name: 'producto_name'
                //readOnly: true
            },{
                xtype: 'spinnerfield',
                label: 'CANTIDAD',
                name: 'cantidad',
                minValue: 1,
                stepValue: 1,
                component: {
                    disabled: false
                }
                //readOnly: true
            },{
                xtype: 'spinnerfield',
                label: 'PRECIO',
                name: 'precio',
                minValue: 0.1,
                stepValue: 0.5,
                component: {
                    disabled: false
                }
                //readOnly: true
            },{
                //label: 'MENSAJE',
                name: 'mensaje',
                //readOnly: true,
                placeHolder: 'MENSAJE'
            }]
        },{
            //xtype: 'container',
            layout: {
                type: 'hbox'
            },
            defaults: {
                xtype: 'button',
                flex: 1
            },
            //cls: 'background_editar',
            height: 65,
            items: [{
                name: 'btnEditar',
                iconCls: 'ico_editar',
                cls: 'btn_editar'/*,
                pressedCls: 'btn_editar_pressed'*/
            },{
                name: 'btnEliminar',
                iconCls: 'ico_eliminar',
                cls: 'btn_eliminar'/*,
                pressedCls: 'btn_eliminar_pressed'*/
            }]
        }/*,{
            label: 'EDITAR',
            id: 'textEditado',
            readOnly: true,
            value: ''
        },{
            xtype: 'teclado'
        }*/]
    }
});