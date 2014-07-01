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
                /*defaults: {
                    xtype: 'radiofield',
                    labelWidth: 100,
                    labelAlign: 'right'
                },*/
                xtype: 'segmentedbutton',
                items: [/*{
                    label: 'NOMBRE',
                    name: 'textFieldName',
                    value: 'nombre'
                },*/{
                    text: 'CANTIDAD',
                    name: 'textFieldName',
                    //value: 'cantidad',
                    pressed: true
                },{
                    text: 'PRECIO',
                    name: 'textFieldName'
                    //value: 'precio'
                },{
                    text: 'MENSAJE',
                    name: 'textFieldName'
                    //value: 'mensaje'
                }]
            }]
        }]
    }
});