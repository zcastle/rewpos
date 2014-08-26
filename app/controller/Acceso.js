Ext.define('rewpos.controller.Acceso', {
    extend: 'Ext.app.Controller',
    config: {
        stores: ['Usuario','Caja'],
        refs: {
            toolbarView: 'toolbarView'
        },
        control: {
            'accesoView': {
                activate: 'onActivate'
            },
            'accesoView dataview': {
                itemtap: 'onItemTapUsuariosList'
            }
        } 
    },
    onActivate: function() {
        rewpos.AppGlobals.CAJA=null;
        rewpos.AppGlobals.USUARIO=null;
        if(rewpos.Menu.ADMIN==null) {
            rewpos.Menu.ADMIN = Ext.create('Ext.Menu', {
                cls: 'menupos',
                items: [{
                    text: 'Anular Documento',
                    handler: this.getApplication().getController('Pedido').anularDocumento
                },{
                    text: 'Cierre Total',
                    handler: this.getApplication().getController('Pedido').cierreParcial
                },{
                    text: 'Configuracion',
                    handler: this.configuracion
                }]
            });
        }
        Ext.Viewport.setMenu(rewpos.Menu.ADMIN, {
            side: 'right',
            reveal: false,
            cover: false
        });
        this.getToolbarView().down('button[name=showmenu]').setHidden(false);
        Ext.getStore('Usuario').clearFilter();
        Ext.getStore('Usuario').filter(function(record) {
            if (record.get('rol_id')==rewpos.AppGlobals.ROL_ID_VENTA || record.get('rol_id')==rewpos.AppGlobals.ROL_ID_VENTA_JEFE) {
                return true;
            }
        });
    },
    onItemTapUsuariosList: function(item, index, target, record) {
        rewpos.AppGlobals.USUARIO = record;
        Ext.ModelManager.getModel('rewpos.model.Caja').load(rewpos.AppGlobals.CAJA_ID,{
            callback: function(caja, operation) {
                //console.log(caja);
                if(caja) {
                    rewpos.AppGlobals.CAJA = caja;
                    this.getToolbarView().down('button[name=empresaLogin]').setText(caja.get('empresa_name')+' - '+caja.get('centrocosto_name'));
                    this.getToolbarView().down('button[name=usuarioLogin]').setText(record.get('nombre')+' '+record.get('apellido'));
                    this.getToolbarView().down('button[name=showmenu]').setHidden(true);
                    this.chageViewToPedido();
                } else {
                    Ext.Msg.alert('Advertencia', 'No se puede hallar la caja con el id: '+rewpos.AppGlobals.CAJA_ID, Ext.emptyFn);
                }
            },
            scope: this
        });
    },
    chageViewToPedido: function() {
        rewpos.Util.showPanel('mainCard', 'authView', 'left');
    },
    configuracion: function() {
        Ext.Viewport.toggleMenu('right');
        var modal = Ext.Viewport.add({xtype: 'autorizacionModal'});
        var cbo = modal.down('selectfield');
        cbo.setHidden(true);
        var btnOk = modal.down('button[action=ok]');
        var pass = modal.down('passwordfield[name=passwordLoginAdmin]');
        btnOk.addListener('tap', function(btn){
            if(pass.getValue()=='2385'){
                Ext.Viewport.remove(btnOk.up('panel'));
                Ext.Viewport.add({xtype: 'configModal'});
            } else {
                pass.setValue('');
                Ext.Msg.alert('Advertencia', 'Clave incorrecta', Ext.emptyFn);
            }
        });
    }
});