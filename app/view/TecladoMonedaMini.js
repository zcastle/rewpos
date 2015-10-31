Ext.define('rewpos.view.TecladoMonedaMini', {
	extend: 'Ext.Container',
    xtype: 'tecladoMonedaMini',
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
                    cls: 'ultimo-panel',
                    name: 'num'
                },{
                    text: '.',
                    cls: 'ultimo-panel',
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
                text: 'ACEPTAR',
                action: 'ok'
            }]
        }]
    }
});