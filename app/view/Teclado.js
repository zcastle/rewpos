Ext.define('rewpos.view.Teclado', {
	extend: 'Ext.Container',
    xtype: 'teclado',
    config: {
    	layout: 'vbox',
        xtype: 'container',
        id: 'teclado',
        items: [{
            layout: 'hbox',
            items: [{
                xtype: 'tecladoNumerico'
            },{
                layout: 'vbox',
                defaults: {
                    xtype: 'button'
                },
                items: [{
                    id: 'btnTecladoBorrar',
                    text: '<-',
                    name: 'accion',
                    flex: 1
                },{
                    id: 'btnTecladoEnter',
                    text: 'ENTER',
                    name: 'accion',
                    flex: 3
                }]
            },{
                layout: 'vbox',
                defaults: {
                    xtype: 'radiofield',
                    labelWidth: 100,
                    labelAlign: 'right'
                },
                items: [{
                    label: 'NOMBRE',
                    name: 'textFieldName',
                    value: 'nombre'
                },{
                    label: 'CANTIDAD',
                    name: 'textFieldName',
                    value: 'cantidad'
                },{
                    label: 'PRECIO',
                    name: 'textFieldName',
                    value: 'precio'
                },{
                    label: 'MENSAJE',
                    name: 'textFieldName',
                    value: 'mensaje'
                }]
            }]
        }]
    }
});