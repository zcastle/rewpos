Ext.define('rewpos.view.TecladoNumerico', {
	extend: 'Ext.Container',
    xtype: 'tecladoNumerico',
    config: {
    	layout: 'vbox',
        flex: 1,
        items: [{
            layout: 'vbox',
            items: [{
                layout: 'hbox',
                defaults: {
                    xtype: 'button',
                    flex: 1
                },
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
                layout: 'hbox',
                defaults: {
                    xtype: 'button',
                    flex: 1
                },
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
                layout: 'hbox',
                defaults: {
                    xtype: 'button',
                    flex: 1
                },
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
            }]
        },{
            layout: 'hbox',
            defaults: {
                xtype: 'button'
            },
            items: [{
                text: '0',
                flex: 2,
                name: 'num'
            },{
                text: '.',
                flex: 1,
                name: 'num'
            }]
        }]
    }
});