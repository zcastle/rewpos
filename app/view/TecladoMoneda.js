Ext.define('rewpos.view.TecladoMoneda', {
	extend: 'Ext.Container',
    xtype: 'tecladoMoneda',
    config: {
        layout: 'hbox',
        cls: 'teclado',
        items: [{
            flex: 1,
            layout: 'vbox',
            defaults: {
                layout: 'hbox',
                defaults: {
                    xtype: 'button',
                    flex: 1
                }
            },
            items: [{
                items: [{
                    text: '1',
                    name: 'num'
                },{
                    text: '2',
                    name: 'num'
                },{
                    text: '3',
                    name: 'num'
                }]
            },{
                items: [{
                    text: '4',
                    name: 'num'
                },{
                    text: '5',
                    name: 'num'
                },{
                    text: '6',
                    name: 'num'
                }]
            },{
                items: [{
                    text: '7',
                    name: 'num'
                },{
                    text: '8',
                    name: 'num'
                },{
                    text: '9',
                    name: 'num'
                }]
            },{
                items: [{
                    text: '0',
                    name: 'num'
                },{
                    text: '.',
                    name: 'num'
                },{
                    text: '<<',
                    name: 'num'
                }]
            }]
        },{
            layout: 'vbox',
            defaults: {
                xtype: 'button',
                flex: 1
            },
            items: [{
                text: 'OK',
                action: 'ok'
            },{
                text : 'CANCELAR',
                action: 'cancelar'
            }]
        }]
    }
});