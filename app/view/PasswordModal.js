Ext.define('rewpos.view.PasswordModal', {
    extend: 'Ext.Panel',
    xtype: 'passwordModal',
    config: {
        centered: true,
        width: 500,
        hideOnMaskTap: true,
        modal: true,
        items: [{
            xtype: 'selectfield',
            name: 'cboAdministradores',
            id: 'cboAdministradores',
            baseCls: 'btn_seleccion'
        },{
            xtype: 'passwordfield',
            label: 'Contraseña',
            labelWidth: 120,
            id: 'passwordLoginAdmin',
            readOnly: true
        },{
            layout: 'hbox',
            style: {
                'margin-top': '10px'
            },
            items: [{
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
                    id: 'btnOkPassword',
                    action: 'ok'
                },{
                    text : 'CANCELAR',
                    action: 'cancelar'
                }]
            }]
        }]
    }
});