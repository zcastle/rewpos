Ext.define('rewpos.view.AuthView', {
	extend: 'Ext.Panel',
    xtype: 'authView',
    config: {
        items: [{
            //xtype: 'container',
            style: {
                'margin': '20px auto 0'
            },
            width: 650,
            items: [{
                xtype: 'passwordfield',
                label: 'Contraseña',
                labelWidth: 120,
                name: 'passwordLogin',
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
                    xtype: 'tecladoNumerico',
                    flex: 1
                }]
            }]
        }]
    }
});