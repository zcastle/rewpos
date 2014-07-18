Ext.define('rewpos.controller.Pedido', {
    extend: 'Ext.app.Controller',
    config: {
        stores: ['Mesa','Pedido','Categoria','Producto', 'Usuario'],
        models: ['Mesa','Pedido','Categoria','Producto'],
        refs: {
            editarForm: 'editarForm',
            seleccionView: 'seleccionView',
            totalesView: 'totales',
            pagosView: 'pagosView',
            toolbarView: 'toolbarView'
        },
        control: {
            'pedidoView': {
                activate: 'activate'
            },
            'seleccionView button': {
                tap: 'ontapSeleccion'
            },
            'seleccionView selectfield': {
                change: 'onChangeCbo'
            },
            'pedidoList': {
                select: 'onSelectPedidoList',
                itemtap: 'onItemTapPedidoList'
            }
        } 
    },
    activate: function(view) {
        /*Ext.create('rewpos.model.Categoria', {
            nombre: 'NUEVO'
        }).save({
            success: function(record) {
                console.log(record);
            },
            scope: this
        });*/
    },
    ontapSeleccion: function(btn) {
        switch(btn.getItemId()) {
            case 'btnSeleccionMesa':
                Ext.getStore('Mesa').load();
                this.getToolbarView().down('button[name=backToPedido]').setHidden(false);
                this.getToolbarView().down('button[name=backToPedido]').setText('MESA: '+btn.getText().substr(3));
                rewpos.Util.showPanel('mainCard', 'mesasView', 'left');
                break;
            case 'lblTotalMonto':
                //Ext.data.Types.NUMBER.convert(btn.getText().substr(4))<=0
                if(Ext.getStore('Pedido').getCount()>0) {
                    var nroatencion = Ext.getStore('Pedido').getAt(0).get('nroatencion');
                    var cliente = Ext.getStore('Pedido').getAt(0).get('cliente_name');
                    if(cliente=='' || cliente==null) {
                        this.getPagosView().down('button[name=btnCliente]').setText('Cliente');
                    } else {
                        this.getPagosView().down('button[name=btnCliente]').setText(cliente);
                    }
                    Ext.getStore('Pago').load({
                        url: rewpos.AppGlobals.HOST+'pedido/pago/'+nroatencion,
                        callback: function() {
                            rewpos.Util.showPanel('comando', 'pagosView', 'right');
                        }
                    });
                }
                break;
        }
    },
    onChangeCbo: function(cbo, newValue, oldValue) {
        //console.log(newValue);
        if(newValue>0 && Ext.getStore('Pedido').getCount()>0){
            var nroatencion = Ext.getStore('Pedido').getAt(0).get('nroatencion');
            var mozo_id = this.getSeleccionView().down('selectfield[name=cboMozos]').getValue();
            var pax = this.getSeleccionView().down('selectfield[name=cboPax]').getValue();
            rewpos.Util.mask();
            Ext.Ajax.request({
                url: rewpos.AppGlobals.HOST+'pedido/actualizar',
                method: 'POST',
                params: {
                    nroatencion: nroatencion,
                    mozo_id: mozo_id,
                    pax: pax
                },
                callback: function(){
                    rewpos.Util.unmask();
                    Ext.getStore('Pedido').each(function(pedido){
                        pedido.set('mozo_id', mozo_id);
                        pedido.set('pax', pax);
                    });
                }
            });
        } /*else if(newValue==0 && Ext.getStore('Pedido').getCount()>0) {
            this.getSeleccionView().down('selectfield[name=cboMozos]').setValue(oldValue);
        }*/
    },
    onSelectPedidoList: function(list, record) {
        if(rewpos.AppGlobals.LIST_SELECTED.getId()=='pedidoList'){
            this.onItemTapPedidoList(list, null, null, record);
        }
    },
    onItemTapPedidoList: function(list, index, target, record) {
        rewpos.AppGlobals.LIST_SELECTED = list;
        this.getEditarForm().setRecord(record);
        rewpos.Util.showPanel('comando', 'editarForm', 'right');
    },
    pagar: function(){
        Ext.Viewport.toggleMenu('right');
        if(rewpos.AppGlobals.DEBUG) {
            Ext.Msg.alert('Advertencia', 'No se puede realizar pagos en modo DEBUG', Ext.emptyFn);
            return;
        }
        if(Ext.getStore('Pedido').getCount()>0){
            var nroatencion = Ext.getStore('Pedido').getAt(0).get('nroatencion');
            rewpos.Util.mask();
            Ext.Ajax.request({
                url: rewpos.AppGlobals.HOST+'pedido/actualizar/debug',
                method: 'POST',
                params: {
                    nroatencion: nroatencion,
                    caja_id: rewpos.AppGlobals.CAJA.get('id'),
                    cajero_id: rewpos.AppGlobals.USUARIO.get('id')
                },
                callback: function(){
                    rewpos.Util.unmask();
                    rewpos.app.getController('Pedido').pagarOk(nroatencion);
                }
            });
        } else {
            Ext.Msg.alert('', 'No hay un pedido para procesar', Ext.emptyFn);
        }
    },
    pagarOk: function(nroatencion) {
        var mozo_id = Ext.getStore('Pedido').getAt(0).get('mozo_id');
        if(mozo_id==0){
            Ext.Msg.alert('Advertencia', 'Debe seleccionar un mozo', Ext.emptyFn);
            return;
        }
        var mensaje = 'Pagar cuenta';
        var valorPedido = 0.0;
        Ext.getStore('Pedido').each(function(record, index, length){
            valorPedido += record.get('cantidad')*record.get('precio')
        }, this)
        Ext.getStore('Pago').load({
            url: rewpos.AppGlobals.HOST+'pedido/pago/'+nroatencion,
            callback: function(records, operation, success) {
                if(records.length==0) {
                    mensaje = 'La cuenta se pagara con el monto exacto, desea continuar?';
                } else {
                    var valorPago = 0.0;
                    Ext.Array.forEach(records, function(record) {
                        valorPago += record.get('valorpago')
                    }, this);
                    if((valorPedido-valorPago)>0) {
                        Ext.Msg.alert('Advertencia', 'Debe terminar de pagar la cuenta', Ext.emptyFn);
                        return;
                    }
                }
                Ext.Msg.show({
                    title: "Confirmacion",
                    message: mensaje,
                    buttons:  [{
                        itemId: 'no',
                        text: 'No'
                    },{
                        itemId: 'yes',
                        text: 'Si'
                    }],
                    fn: function(btn) {
                        if(btn=='yes'){
                            rewpos.Util.mask();
                            Ext.Ajax.request({
                                url: rewpos.AppGlobals.HOST+'pedido/pagar',
                                method: 'POST',
                                params: {
                                    nroatencion: nroatencion
                                },
                                callback: function(request, success, response){
                                    rewpos.Util.unmask();
                                    var text = Ext.JSON.decode(response.responseText);
                                    if(text.success){
                                        //console.log(text.data.id);
                                        console.log('Enviando Comprobante');
                                        Ext.Ajax.request({
                                            url: rewpos.AppGlobals.HOST_PRINT+'print/factura/'+text.data.id,
                                            callback: function(){
                                                console.log('Enviado');
                                            }
                                        });
                                        Ext.getStore('Pago').removeAll();
                                        Ext.getStore('Pedido').removeAll();
                                        rewpos.app.getController('Pedido').getTotalesView().down('label[name=lblTotalItems]').setHtml('TOTAL ITEMS: 0');
                                        rewpos.app.getController('Pedido').getSeleccionView().down('button[name=lblTotalMonto]').setText(rewpos.AppGlobals.MONEDA_SIMBOLO+'0.00');
                                    } else {
                                        Ext.Msg.alert('Advertencia', 'Error al pagar la cuenta', Ext.emptyFn);
                                    }
                                    
                                }
                            });
                        }
                    },
                    scope: this
                });
            },
            scope: this
        });
    },
    liberar: function() {
        Ext.Viewport.toggleMenu('right');
        if(Ext.getStore('Pedido').getCount()>0){
            var nroatencion = Ext.getStore('Pedido').getAt(0).get('nroatencion');
            var mensaje = 'Desea liberar la mesa: '+nroatencion;
            Ext.Msg.show({
                title: "Confirmacion",
                message: mensaje,
                buttons:  [{
                    itemId: 'no',
                    text: 'No'
                },{
                    itemId: 'yes',
                    text: 'Si'
                }],
                fn: function(btn) {
                    if(btn=='yes'){

                        Ext.Viewport.add({xtype: 'passwordModal'});
                        var btnOk = Ext.getCmp('btnOkPassword');
                        var cboAdministradores = Ext.getCmp('cboAdministradores');
                        var passwordLoginAdmin = Ext.getCmp('passwordLoginAdmin');
                        btnOk.addListener('tap', function(btn){
                            var adminId = cboAdministradores.getValue();
                            if(adminId>0) {
                                var pass1 = rewpos.Util.MD5(passwordLoginAdmin.getValue()).toUpperCase();
                                var pass2 = Ext.getStore('Usuario').findRecord('id', adminId).get('clave').toUpperCase();
                                if(pass1==pass2){
                                    Ext.Viewport.remove(btnOk.up('panel'));
                                    rewpos.Util.mask();
                                    Ext.Ajax.request({
                                        url: rewpos.AppGlobals.HOST+'pedido/liberar/'+adminId,
                                        method: 'POST',
                                        params: {
                                            nroatencion: nroatencion
                                        },
                                        callback: function(request, success, response){
                                            rewpos.Util.unmask();
                                            var res = Ext.JSON.decode(response.responseText);
                                            if(res.success){
                                                Ext.getStore('Pago').removeAll();
                                                Ext.getStore('Pedido').removeAll();
                                                rewpos.app.getController('Pedido').getTotalesView().down('label[name=lblTotalItems]').setHtml('TOTAL ITEMS: 0');
                                                rewpos.app.getController('Pedido').getSeleccionView().down('button[name=lblTotalMonto]').setText(rewpos.AppGlobals.MONEDA_SIMBOLO+'0.00');
                                                rewpos.Util.showPanel('comando', 'productoView', 'left');
                                                //console.log(res.data.id);
                                                Ext.Ajax.request({
                                                    url: rewpos.AppGlobals.HOST_PRINT+'print/pedido/liberar/'+res.data.id,
                                                    callback: function(request, success, response){
                                                        var text = Ext.JSON.decode(response.responseText);
                                                        if(!text.success) {
                                                            Ext.Msg.alert('Advertencia', 'Error al imprimir LIBERADO', Ext.emptyFn);
                                                        }
                                                    }
                                                });
                                            } else {
                                                Ext.Msg.alert('Advertencia', 'Error al liberar la mesa', Ext.emptyFn);
                                            }
                                        }
                                    });
                                } else {
                                    passwordLoginAdmin.setValue('');
                                    Ext.Msg.alert('Advertencia', 'Clave incorrecta', Ext.emptyFn);
                                }
                            } else {
                                Ext.Msg.alert('Advertencia', 'Elija un administrador', Ext.emptyFn);
                            }
                        });

                    }
                },
                scope: this
            });
        } else {
            Ext.Msg.alert('', 'No hay un mesa para liberar', Ext.emptyFn);
        }
    },
    cambiar: function() {
        Ext.Viewport.toggleMenu('right');
        if(Ext.getStore('Pedido').getCount()>0){
            var nroatencion = Ext.getStore('Pedido').getAt(0).get('nroatencion');
            Ext.Msg.show({
                title: 'Cambiar Mesa', 
                message: 'Ingrese el numero de mesa de destino:', 
                fn: function(btn, nrodestino) {
                    if(btn=='ok' && nrodestino!=null) {
                        if(nrodestino==nroatencion) return;
                        //nrodestino = text; //Ext.data.Types.NUMBER.convert(text)
                        //Ext.isNumber(nrodestino)
                        if(Ext.isNumber(nrodestino) && (nrodestino>=1 && nrodestino<=rewpos.AppGlobals.MAX_MESAS)) {
                            rewpos.Util.mask();
                            Ext.Ajax.request({
                                url: rewpos.AppGlobals.HOST+'pedido/cambiar',
                                method: 'POST',
                                params: {
                                    nroatencion: nroatencion,
                                    nrodestino: nrodestino
                                },
                                callback: function(request, success, response){
                                    rewpos.Util.unmask();
                                    Ext.getStore('Pedido').each(function(record){
                                        record.set('nroatencion', nrodestino);
                                    });
                                    var res = Ext.JSON.decode(response.responseText);
                                    if(res.success){
                                        //Ext.getCmp('btnSeleccionMesa').setText('M: '+nrodestino);
                                        rewpos.app.getController('Pedido').getSeleccionView().down('button[name=btnSeleccionMesa]').setText('M: '+nrodestino);
                                    } else {
                                        if(res.error=='destinoexiste') {
                                            Ext.Msg.alert('Advertencia', 'La mesa de destino esta ocupada', Ext.emptyFn);
                                        }else{
                                            Ext.Msg.alert('Advertencia', 'Error al cambiar mesa', Ext.emptyFn);
                                        }
                                    }
                                }
                            });
                        } else {
                            Ext.Msg.alert('Advertencia', 'Debe ingresar un numero de mesa valido entre 1 y 100', Ext.emptyFn);
                        }
                    }
                },
                buttons:  [{
                    itemId: 'ok',
                    text: 'Aceptar'
                },{
                    itemId: 'cancel',
                    text: 'Cancelar'
                }],
                prompt: {
                    xtype: 'spinnerfield',
                    component: {
                        disabled: false
                    },
                    minValue: 1,
                    maxValue: rewpos.AppGlobals.MAX_MESAS,
                    stepValue: 1,
                    cycle: true,
                    listeners: {
                        painted: function(sf) {
                            this.setValue(nroatencion);
                        }
                    }
                },
                scope: this
            });
        } else {
            Ext.Msg.alert('', 'No hay un mesa para cambiar', Ext.emptyFn);
        }
    },
    resumen: function() {
        Ext.Viewport.toggleMenu('right');
        if(rewpos.AppGlobals.DEBUG) {
            Ext.Msg.alert('Advertencia', 'No se puede ver el resumen en modo DEBUG', Ext.emptyFn);
            return;
        }
        rewpos.Util.mask();
        var cajaId = rewpos.AppGlobals.CAJA.get('id');
        Ext.Ajax.request({
            url: rewpos.AppGlobals.HOST+'pedido/resumen/'+cajaId,
            callback: function(request, success, response){
                rewpos.Util.unmask();
                var text = Ext.JSON.decode(response.responseText);
                var atenciones = Ext.data.Types.NUMBER.convert(text.data[0].Atenciones);
                var ventas = Ext.data.Types.NUMBER.convert(text.data[0].Ventas);
                var total = atenciones+ventas;

                var atenciones = rewpos.Util.toFixed(atenciones, 2);
                var ventas = rewpos.Util.toFixed(ventas, 2);
                var total = rewpos.Util.toFixed(total, 2);
                Ext.Msg.show({
                    title: 'Resumen Diario', 
                    message: '<div id="resumenMessage">'+
                    '<div class="titulo">Atenciones:</div><div class="valor">'+atenciones+'</div><br/>'+
                    '<div class="titulo">Ventas:</div><div class="valor">'+ventas+'</div><br/>'+
                    '-----------------------------------------------------------<br/>'+
                    '<div class="titulo">Total:</div><div class="valor">'+total+'</div>'+
                    '</div>',
                    fn: Ext.emptyFn
                });
            }
        });
    },
    cierreParcial: function() {
        Ext.Viewport.toggleMenu('right');
        Ext.Viewport.add({xtype: 'passwordModal'});
        var btnOk = Ext.getCmp('btnOkPassword');
        var cboAdministradores = Ext.getCmp('cboAdministradores');
        var passwordLoginAdmin = Ext.getCmp('passwordLoginAdmin');
        btnOk.addListener('tap', function(btn){
            var adminId = cboAdministradores.getValue();
            if(adminId>0) {
                var pass1 = rewpos.Util.MD5(passwordLoginAdmin.getValue()).toUpperCase();
                var pass2 = Ext.getStore('Usuario').findRecord('id', adminId).get('clave').toUpperCase();
                if(pass1==pass2){
                    Ext.Viewport.remove(btnOk.up('panel'));
                    rewpos.Util.mask();
                    var cajaId = rewpos.AppGlobals.CAJA.get('id');
                    var cajeroId = rewpos.AppGlobals.USUARIO.get('id');
                    Ext.Ajax.request({
                        url: rewpos.AppGlobals.HOST_PRINT+'print/cierre/'+cajaId+'/'+cajeroId,
                        callback: function(request, success, response){
                            var text = Ext.JSON.decode(response.responseText);
                            if(!text.success) {
                                Ext.Msg.alert('Advertencia', 'Error en cierre PARCIAL', Ext.emptyFn);
                            }
                        }
                    });
                } else {
                    passwordLoginAdmin.setValue('');
                    Ext.Msg.alert('Advertencia', 'Clave incorrecta', Ext.emptyFn);
                }
            } else {
                Ext.Msg.alert('Advertencia', 'Elija un administrador', Ext.emptyFn);
            }
        });
    }
});