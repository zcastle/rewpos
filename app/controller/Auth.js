Ext.define('rewpos.controller.Auth', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            passwordLogin: '#passwordLogin'
        },
        control: {
            'authView': {
                activate: 'onActivate'
            },
            'authView button[name=num]': {
                tap: 'onTapNum'
            },
            'authView button[name=action]': {
                tap: 'onTapAction'
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
    },
    onTapNum: function(btn) {
        if(btn.getText()=='<<') {
            this.getPasswordLogin().setValue('');
        } else {
            this.getPasswordLogin().setValue(this.getPasswordLogin().getValue()+btn.getText());
        }
    },
    onTapAction: function(btn) {
        var pass1 = rewpos.Util.MD5(this.getPasswordLogin().getValue()).toUpperCase();
        this.getPasswordLogin().setValue('');
        if(btn.getText()=='OK'){
            var pass2 = rewpos.AppGlobals.USUARIO.get('clave').toUpperCase();
            if(pass1==pass2){
                rewpos.Util.showPanel('mainCard', 'pedidoView', 'left');
            } else {
                Ext.Msg.alert('Advertencia', 'Clave incorrecta', Ext.emptyFn);
            }
        } else if(btn.getText()=='CANCELAR'){
            Ext.getCmp('empresaLogin').setText(rewpos.AppGlobals.CORPORACION);
            Ext.getCmp('usuarioLogin').setText('');
            rewpos.Util.showPanel('mainCard', 'accesoView', 'right');
        }
    }
});