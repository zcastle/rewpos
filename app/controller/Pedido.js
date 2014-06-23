Ext.define('rewpos.controller.Pedido', {
    extend: 'Ext.app.Controller',
    config: {
        stores: ['Mesa','Pedido','Categoria','Producto'],
        models: ['Mesa','Pedido','Categoria','Producto'],
        refs: {
            editarForm: 'editarForm',
            seleccion: 'seleccion'
        },
        control: {
            'pedidoView': {
                activate: 'activate'
            },
            'seleccion button': {
                tap: 'ontapSeleccion'
            },
            'pedidoList': {
                itemtap: 'onItemTapPedidoList'
            },
            'categoriaList': {
                itemtap: 'onItemTapCategoriaList'
            },
            'productoList': {
                itemtap: 'onItemTapProductoList'
            }
        } 
    },
    activate: function(view) {},
    ontapSeleccion: function(btn) {
        switch(btn.name) {
            case 'btnSeleccionMesa':
                Ext.getStore('Mesa').load();
                Ext.getCmp('backToPedido').setHidden(false);
                Ext.getCmp('backToPedido').setText('MESA: '+btn.getText().substr(3));
                if(rewpos.AppGlobals.ANIMACION) {
                    Ext.getCmp('mainCard').animateActiveItem('mesasView', {
                            type: 'slide',
                            direction: 'left'
                        }
                    );
                } else {
                    Ext.getCmp('mainCard').setActiveItem('mesasView');
                }
                break;
        }
    },
    onItemTapPedidoList: function(item, index, target, record) {
        //console.log(record);
        Ext.getCmp('textEditado').setValue('');
        this.getEditarForm().setRecord(record);
        if(rewpos.AppGlobals.ANIMACION) {
            Ext.getCmp('comando').animateActiveItem('editarForm', {
                    type: 'slide',
                    direction: 'right'
                }
            );
        } else {
            Ext.getCmp('comando').setActiveItem('editarForm');
        }
    },
    onItemTapCategoriaList: function(item, index, target, record) {
        Ext.getStore('Producto').load({url: rewpos.AppGlobals.HOST+'producto/pos/categoria/'+record.get('id')});
    },
    onItemTapProductoList: function(item, index, target, record) {
        var mesa = this.getSeleccion().down('button[name=btnSeleccionMesa]').getText().substr(3);
        var mozo_id = this.getSeleccion().down('selectfield[name=cboMozos]').getValue();
        var pax = this.getSeleccion().down('button[name=cboPax]').getText().substr(3);
        var existRecord = Ext.getStore('Pedido').findRecord('producto_id', record.getId());
        if (existRecord) {
            var cantidad = existRecord.get('cantidad')+1;
            existRecord.set('cantidad', cantidad);
            existRecord.save();
        } else {
            Ext.create('rewpos.model.Pedido', {
                nroatencion: mesa,
                cajero_id: rewpos.AppGlobals.USUARIO.get('id'),
                mozo_id: mozo_id,
                producto_id: record.get('id'),
                producto_name: record.get('nombre'),
                cantidad: 1,
                precio: record.get('precio'),
                cliente_id: '',
                caja_id: rewpos.AppGlobals.CAJA.get('id'),
                pax: pax,
                mensaje: '' 
            }).save({
                success: function(record) {
                    Ext.getStore('Pedido').add(record);
                },
                scope: this
            });
        }
    }
});