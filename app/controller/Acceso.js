Ext.define('rewpos.controller.Acceso', {
    extend: 'Ext.app.Controller',
    config: {
        stores: ['Usuario','Caja'],
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
                    Ext.getCmp('empresaLogin').setText(records[0].get('empresa_name')+' - '+records[0].get('centrocosto_name'));
                    Ext.getCmp('usuarioLogin').setText(record.get('nombre')+' '+record.get('apellido'));
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
        if(rewpos.AppGlobals.ANIMACION) {
            Ext.getCmp('mainCard').animateActiveItem('pedidoView', {
                    type: 'slide',
                    direction: 'left'
                }
            );
        } else {
            Ext.getCmp('mainCard').setActiveItem('pedidoView');
        }
    }
});