Ext.define('rewpos.view.EditarForm', {
	extend: 'Ext.form.Panel',
    xtype: 'editarForm',
    config: {
        defaults: {
            xtype: 'textfield'
        },
        items: [{
            label: 'NOMBRE',
            name: 'producto_name',
            readOnly: true
        },{
            label: 'CANTIDAD',
            name: 'cantidad',
            readOnly: true
        },{
            label: 'PRECIO',
            name: 'precio',
            readOnly: true
        },{
            label: 'MENSAJE',
            name: 'mensaje',
            readOnly: true,
            placeHolder: 'MENSAJE'
        },{
            xtype: 'container',
            layout: {
                type: 'hbox'
            },
            defaults: {
                xtype: 'button',
                flex: 1
            },
            cls: 'background_editar',
            height: 65,
            items: [{
                name: 'btnEditar',
                cls: 'btn_editar',
                pressedCls: 'btn_editar_pressed'
            },{
                name: 'btnEliminar',
                cls: 'btn_eliminar',
                pressedCls: 'btn_eliminar_pressed'
            }]
        },{
            label: 'EDITAR',
            id: 'textEditado',
            readOnly: true,
            value: ''
        },{
            xtype: 'teclado'
        }]
    }
});