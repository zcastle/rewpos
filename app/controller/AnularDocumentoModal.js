Ext.define('rewpos.controller.AnularDocumentoModal', {
    extend: 'Ext.app.Controller',
    config: {
        stores: ['Venta', 'Pedido'],
        models: ['Venta'],
        refs: {
            list: 'anularDocumentoModal list',
            txtObservacion: 'anularDocumentoModal textfield[name=observacion]'
        },
        control: {
            'anularDocumentoModal': {
                initialize: 'onInitialize',
                hide: 'onHide'
            },
            'anularDocumentoModal searchfield': {
                keyup: 'onSearchKeyUp',
                clearicontap: 'onSearchClearIconTap'
            },
            'anularDocumentoModal button[name=btnCancelar]': {
                tap: 'onTapButtonCancelar'
            },
            'anularDocumentoModal button[name=btnAnular]': {
                tap: 'onTapButtonAnular'
            }
        }
    },
    onInitialize: function(view){
        var caja_id, cajero_id, url;
        if(rewpos.AppGlobals.CAJERO==null){
            view.setHidden(true);
            var modal = Ext.Viewport.add({xtype: 'autorizacionModal'});
            var cbo = modal.down('selectfield[name=cboAdministradores]');
            var pass = modal.down('passwordfield[name=passwordLoginAdmin]');
            var btnOk = modal.down('button[action=ok]');
            btnOk.addListener('tap', function(btn){
                var adminId = cbo.getValue();
                if(adminId>0) {
                    var pass1 = rewpos.Util.MD5(pass.getValue()).toUpperCase();
                    var pass2 = Ext.getStore('Admin').findRecord('id', adminId).get('clave').toUpperCase();
                    if(pass1==pass2){
                        rewpos.Util.mask();
                        pass.setValue('');
                        Ext.Viewport.remove(btnOk.up('panel'));
                        view.setHidden(false);
                        var centrocostoId = Ext.getStore('Admin').findRecord('id', adminId).get('centrocosto_id')
                        var urlCaja = Ext.getStore('Caja').getProxy().getUrl()+'/'+centrocostoId;
                        Ext.getStore('Caja').load({
                            url: urlCaja,
                            callback: function(records, operation, success) {
                                if(records.length==1){
                                    caja_id = records[0].get('id');
                                    url = rewpos.AppGlobals.HOST+'venta/anular/'+caja_id;
                                    Ext.getStore('Venta').load({
                                        url: url
                                    })
                                } else {
                                    Ext.Array.forEach(records, function(item) {
                                        
                                    }, this);
                                }
                            },
                            scope: this
                        })
                    } else {
                        pass.setValue('');
                        Ext.Msg.alert('Advertencia', 'Clave incorrecta', Ext.emptyFn);
                    }
                } else {
                    Ext.Msg.alert('Advertencia', 'Elija un administrador', Ext.emptyFn);
                }
            });
        } else {
            caja_id = rewpos.AppGlobals.CAJA_ID;
            cajero_id = rewpos.AppGlobals.CAJERO.get('id');
            url = rewpos.AppGlobals.HOST+'venta/anular/'+caja_id+"/"+cajero_id;
            Ext.getStore('Venta').load({
                url: url
            })
        }
    },
    onSearchKeyUp: function(field, e) {
        var keyCode = e.event.keyCode;
        //console.log(keyCode);
        //return;
        if(keyCode == 13) {
            var numero = field.getValue();
            //field.reset();
            caja_id = rewpos.AppGlobals.CAJA_ID;
            url = rewpos.AppGlobals.HOST+'venta/anular/'+caja_id
            console.log(rewpos.AppGlobals.CAJERO);
            if(rewpos.AppGlobals.CAJERO!=null){
                cajero_id = rewpos.AppGlobals.CAJERO.get('id');
                url += "/"+cajero_id;
            }
            if(Ext.String.trim(numero)!=""){
                url += "/"+numero;
            }
            Ext.getStore('Venta').load({
                url: url,
                callback: function(records) {
                    this.getList().select(0);
                },
                scope: this
            })
        }
    },
    onSearchClearIconTap: function() {
        caja_id = rewpos.AppGlobals.CAJA_ID;
        url = rewpos.AppGlobals.HOST+'venta/anular/'+caja_id
        if(rewpos.AppGlobals.CAJERO!=null){
            cajero_id = rewpos.AppGlobals.CAJERO.get('id');
            url += "/"+cajero_id;
        }
        Ext.getStore('Venta').load({
            url: url
        })
    },
    onHide: function(view) {
        Ext.Viewport.remove(view);
    },
    onTapButtonCancelar: function(btn) {
        Ext.Viewport.remove(btn.up('panel'));
    },
    onTapButtonAnular: function(btn) {
        var record = this.getList().getSelection()[0];
        //console.log(this.getTxtObservacion());
        var obs = this.getTxtObservacion().getValue();
        if(record!=undefined){
            if(record.get('anulado')){
                Ext.Msg.alert('Advertencia', 'El docuento esta anulado', Ext.emptyFn);
                return;
            }
            var venta_id = record.get('id');
            Ext.Viewport.remove(btn.up('panel'));
            var modal = Ext.Viewport.add({xtype: 'autorizacionModal'});
            var cbo = modal.down('selectfield[name=cboAdministradores]');
            var pass = modal.down('passwordfield[name=passwordLoginAdmin]');
            var btnOk = modal.down('button[action=ok]');
            btnOk.addListener('tap', function(btn){
                var adminId = cbo.getValue();
                if(adminId>0) {
                    var pass1 = rewpos.Util.MD5(pass.getValue()).toUpperCase();
                    var pass2 = Ext.getStore('Admin').findRecord('id', adminId).get('clave').toUpperCase();
                    if(pass1==pass2){
                        Ext.Viewport.remove(btnOk.up('panel'));
                        rewpos.Util.mask();
                        
                        //console.log(obs);
                        Ext.Ajax.request({
                            url: rewpos.AppGlobals.HOST+'venta/anular',
                            method: 'POST',
                            params: {
                                venta_id: venta_id,
                                anulado_id: adminId,
                                anulado_message: obs
                            },
                            callback: function(){
                                rewpos.Util.unmask()
                                //record.set('anulado', true);
                                Ext.ModelManager.getModel('rewpos.model.Imprimir').load("anular/"+venta_id,{
                                    callback: function(record, operation) {}
                                });
                            }
                        });
                    } else {
                        pass.setValue('');
                        Ext.Msg.alert('Advertencia', 'Clave incorrecta', Ext.emptyFn);
                    }
                } else {
                    Ext.Msg.alert('Advertencia', 'Elija un administrador', Ext.emptyFn);
                }
            });
        }
    }
});