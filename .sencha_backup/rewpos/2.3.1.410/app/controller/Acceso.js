Ext.define('rewpos.controller.Acceso', {
    extend: 'Ext.app.Controller',
    config: {
        stores: ['Pedido', 'Cajero','Mozo','Caja'],
        refs: {
            toolbarView: 'toolbarView',
            seleccionView: 'seleccionView'
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
    onActivate: function(view) {
        rewpos.AppGlobals.CAJERO = null;
        if(rewpos.Menu.ADMIN==null) {
            rewpos.Menu.ADMIN = Ext.create('Ext.Menu', {
                cls: 'menupos',
                items: [{
                    text: 'Anular Documento',
                    handler: this.getApplication().getController('Pedido').anularDocumento
                },{
                    text: 'Cierre Z',
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
    },
    onItemTapUsuariosList: function(item, index, target, record) {
        this.getSeleccionView().down('button[name=btnSeleccionMesa]').setText('M: 1');
        Ext.getStore('Pedido').load({
            url: rewpos.AppGlobals.HOST+'pedido/1/'+rewpos.AppGlobals.CAJA_ID,
            callback: function(records) {
                if(records.length>0){
                    this.getSeleccionView().down('selectfield[name=cboMozos]').setValue(records[0].get('mozo_id'));
                    this.getSeleccionView().down('selectfield[name=cboPax]').setValue(records[0].get('pax'));
                }
            },
            scope: this
        });
        rewpos.AppGlobals.CAJERO = record;
        this.getToolbarView().down('button[name=usuarioLogin]').setText(record.get('nombre')+' '+record.get('apellido'));
        this.getToolbarView().down('button[name=showmenu]').setHidden(true);
        if(rewpos.AppGlobals.CAJA.get('tipo')=='P') {
            //this.getSeleccionView().down('selectfield[name=cboMozos]').setValueField(record.get('id'));
            this.getSeleccionView().down('selectfield[name=cboMozos]').setOptions({
                value: record.get('id'),
                text: record.get('nombre')+' '+record.get('apellido')
            });
            this.getSeleccionView().down('selectfield[name=cboMozos]').disable();
        }
        //this.chageViewToPedido();
        if(rewpos.AppGlobals.CAJERO.get("rol_id")==2){
            rewpos.Util.showPanel('mainCard', 'authView', 'left');
        }else{
            rewpos.Util.showPanel('mainCard', 'pedidoView', 'left');
        }
    },
    /*chageViewToPedido: function() {
        if(rewpos.AppGlobals.CAJERO.get("rol_id")==2){
            rewpos.Util.showPanel('mainCard', 'authView', 'left');
        }else{
            rewpos.Util.showPanel('mainCard', 'pedidoView', 'left');
        }
    },*/
    configuracion: function() {
        Ext.Viewport.hideAllMenus(true); //toggleMenu('right');
        //rewpos.Util.showPanel('mainCard', 'configuracionView', 'left');
        var modal = Ext.Viewport.add({xtype: 'autorizacionModal'});
        var cbo = modal.down('selectfield');
        cbo.setHidden(true);
        var btnOk = modal.down('button[action=ok]');
        var pass = modal.down('passwordfield[name=passwordLoginAdmin]');
        btnOk.addListener('tap', function(btn){
            var p = rewpos.Util.MD5(pass.getValue()).toLowerCase();
            if(p=='1a68e5f4ade56ed1d4bf273e55510750'){
                Ext.Viewport.remove(btnOk.up('panel'));
                Ext.Viewport.add({xtype: 'configModal'});
            } else {
                pass.setValue('');
                Ext.Msg.alert('Advertencia', 'Clave incorrecta', Ext.emptyFn);
            }
        });
    }
});