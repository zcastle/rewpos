Ext.define('rewpos.view.AuthView', {
	extend: 'Ext.Container',
    xtype: 'authView',
    config: {
        items: [{
            xtype: 'container',
            style: {
                'margin': '20px auto 0'
            },
            width: 500,
            items: [{
                xtype: 'passwordfield',
                label: 'Contraseña',
                labelWidth: 110,
                id: 'passwordLogin',
                readOnly: true
            },{
                layout: 'hbox',
                style: {
                    'margin-top': '15px'
                },
                items: [{
                    layout: 'vbox',
                    items: [{
                        xtype: 'image',
                        height: 128,
                        width: 128,
                        src: 'resources/images/usuario_m.png'
                    },{
                        xtype: 'label'
                    }]
                },{
                    xtype: 'tecladoPass'
                },{
                    width: 5
                },{
                    layout: 'vbox',
                    defaults: {
                        xtype: 'button',
                        flex: 1
                    },
                    items: [{
                        text: 'OK',
                        name: 'action'
                    },{
                        text : 'CANCELAR',
                        name: 'action'
                    }]
                }]
            }]
        }]
    }
});