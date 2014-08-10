Ext.define('rewpos.controller.AutorizacionModal', {
    extend: 'Ext.app.Controller',
    config: {
        stores: ['Usuario'],
        refs: {
            autorizacionModal: 'autorizacionModal'
        },
        control: {
            'autorizacionModal': {
                initialize: 'onInitialize',
                hide: 'onHide'
            },
            'autorizacionModal button[action=cancelar]': {
                tap: 'onTapButtonCancelar'
            },
            'autorizacionModal button[name=num]': {
                tap: 'onTapNum'
            }
        } 
    },
    onInitialize: function(view) {
        var administradores = new Array();
        administradores.push({
            text: 'Seleccionar',
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
        Ext.getStore('Usuario').clearFilter();
        Ext.getStore('Usuario').filter(function(record) {
            if (record.get('rol_id')==rewpos.AppGlobals.ROL_ID_VENTA || record.get('rol_id')==rewpos.AppGlobals.ROL_ID_VENTA_JEFE) {
                return true;
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
        var txtPassword = this.getAutorizacionModal().down('passwordfield[name=passwordLoginAdmin]');
        if(btn.getItemId()=='borrar') {
            txtPassword.setValue('');
        } else {
            txtPassword.setValue(txtPassword.getValue()+btn.getText());
        }
    }
});