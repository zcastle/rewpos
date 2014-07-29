Ext.define('rewpos.controller.Auth', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            authView: 'authView',
            toolbarView: 'toolbarView'
        },
        control: {
            'authView': {
                activate: 'onActivate'
            },
            'tecladoNumerico button[name=num]': {
                tap: 'onTapNum'
            },
            'authView button[action=ok]': {
                tap: 'onTapActionOk'
            },
            'authView button[action=cancelar]': {
                tap: 'onTapActionCancelar'
            }
        } 
    },
    onActivate: function(view) {
        var sx = rewpos.AppGlobals.USUARIO.get('sexo');
        if(sx=='M') {
            view.down('image').setSrc('resources/images/usuario_m.png');
        } else {
            view.down('image').setSrc('resources/images/usuario_f.png');
        }
        view.down('label').setHtml(rewpos.AppGlobals.USUARIO.get('nombre')+' '+rewpos.AppGlobals.USUARIO.get('apellido'));
        view.down('passwordfield').setValue('');
    },
    onTapNum: function(btn) {
        var txtPassword = this.getAuthView().down('passwordfield[name=passwordLogin]');
        if(btn.getText()=='<<') {
            txtPassword.setValue('');
        } else {
            txtPassword.setValue(txtPassword.getValue()+btn.getText());
        }
    },
    onTapActionOk: function() {
        var txtPassword = this.getAuthView().down('passwordfield[name=passwordLogin]');
        var pass1 = rewpos.Util.MD5(txtPassword.getValue()).toUpperCase();
        txtPassword.setValue('');
        var pass2 = rewpos.AppGlobals.USUARIO.get('clave').toUpperCase();
        if(pass1==pass2){
            rewpos.Util.showPanel('mainCard', 'pedidoView', 'left');
        } else {
            Ext.Msg.alert('Advertencia', 'Clave incorrecta', Ext.emptyFn);
        }
    },
    onTapActionCancelar: function(btn) {
        var txtPassword = this.getAuthView().down('passwordfield[name=passwordLogin]');
        txtPassword.setValue('');
        this.getToolbarView().down('button[name=empresaLogin]').setText(rewpos.AppGlobals.CORPORACION);
        this.getToolbarView().down('button[name=usuarioLogin]').setText('');
        rewpos.Util.showPanel('mainCard', 'accesoView', 'right');
    }
});