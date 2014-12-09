Ext.define('rewpos.view.AutorizacionModal', {
    extend: 'Ext.Panel',
    xtype: 'autorizacionModal',
    config: {
        cls: 'modal',
        centered: true,
        width: 500,
        hideOnMaskTap: true,
        modal: true,
        items: [{
            xtype: 'label',
            html: 'Autorizacion',
            cls: 'titulo-modal'
        },{
            xtype: 'fieldset',
            defaults: {
                labelWidth: 120
            },
            items: [{
                xtype: 'selectfield',
                label: 'Administrador',
                name: 'cboAdministradores'
            },{
                xtype: 'passwordfield',
                label: 'Contraseña',
                name: 'passwordLoginAdmin',
                readOnly: true
            }]
        },{
            xtype: 'tecladoNumerico'
        }]
    }
});