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
        var centrocostoId = record.get('centrocosto_id');
        rewpos.AppGlobals.USUARIO = record;
        var url = Ext.getStore('Caja').getProxy().getUrl()+'/'+centrocostoId;
        Ext.getStore('Caja').load({
            url: url,
            callback: function(records, operation, success) {
                if(records.length==1){
                    rewpos.AppGlobals.CAJA = records[0];
                    this.getToolbarView().down('button[name=empresaLogin]').setText(records[0].get('empresa_name')+' - '+records[0].get('centrocosto_name'));
                    this.getToolbarView().down('button[name=usuarioLogin]').setText(record.get('nombre')+' '+record.get('apellido'));
                    this.getToolbarView().down('button[name=showmenu]').setHidden(true);
                    this.chageViewToPedido();
                } else {
                    Ext.Array.forEach(records, function(item) {
                        
                    }, this);
                }
            },
            scope: this
        })
    },
    chageViewToPedido: function() {
        rewpos.Util.showPanel('mainCard', 'authView', 'left');
    }
});