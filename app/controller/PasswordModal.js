Ext.define('rewpos.controller.PasswordModal', {
    extend: 'Ext.app.Controller',
    config: {
        stores: ['Usuario'],
        refs: {
            passwordLogin: '#passwordLoginAdmin'
        },
        control: {
            'passwordModal': {
                initialize: 'onInitialize',
                hide: 'onHide'
            },
            'passwordModal button[action=cancelar]': {
                tap: 'onTapButtonCancelar'
            },
            'passwordModal button[name=num]': {
                tap: 'onTapNum'
            }
        } 
    },
    onInitialize: function(view) {
        var administradores = new Array();
        administradores.push({
            text: 'Elegir Administrador',
            value: 0
        });
        Ext.getStore('Usuario').clearFilter();
        Ext.getStore('Usuario').each(function(item){
            if(item.get('rol_id')==rewpos.AppGlobals.ROL_ID_ADMINISTRADOR) {
                administradores.push({
                    text: item.get('nombre')+' '+item.get('apellido'),
                    value: item.get('id')
                })
            }
        });
        view.down('selectfield[name=cboAdministradores]').setOptions(administradores);
    },
    onHide: function(view) {
        Ext.Viewport.remove(view);
    },
    onTapButtonCancelar: function(btn) {
        Ext.Viewport.remove(btn.up('panel'));
    },
    onTapNum: function(btn) {
        if(btn.getText()=='<<') {
            this.getPasswordLogin().setValue('');
        } else {
            this.getPasswordLogin().setValue(this.getPasswordLogin().getValue()+btn.getText());
        }
    }
});