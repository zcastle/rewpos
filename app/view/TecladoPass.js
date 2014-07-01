Ext.define('rewpos.view.TecladoPass', {
	extend: 'Ext.Container',
    xtype: 'tecladoPass',
    config: {
    	layout: 'vbox',
        flex: 1,
        items: [{
            layout: 'vbox',
            defaults: {
                layout: 'hbox',
                defaults: {
                    xtype: 'button',
                    flex: 1,
                    height: 60
                },
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
            }]
        },{
            layout: 'hbox',
            defaults: {
                xtype: 'button',
                height: 60
            },
            items: [{
                text: '0',
                flex: 2,
                name: 'num'
            },{
                text: '<<',
                flex: 1,
                name: 'num'
            }]
        }]
    }
});