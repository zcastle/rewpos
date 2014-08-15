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
                activate: 'onActivate'
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
    onActivate: function(){
        Ext.Viewport.setMenu(rewpos.Menu.USUARIO, {
            side: 'right',
            reveal: false,
            cover: false
        });
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
                            rewpos.Util.showPanel('comandoCard', 'pagosView', 'right');
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
        if(rewpos.AppGlobals.LIST_SELECTED==null) return;
        if(rewpos.AppGlobals.LIST_SELECTED.getId()=='pedidoList'){
            this.onItemTapPedidoList(list, null, null, record);
        }
    },
    onItemTapPedidoList: function(list, index, target, record) {
        rewpos.AppGlobals.LIST_SELECTED = list;
        this.getEditarForm().setRecord(record);
        rewpos.Util.showPanel('comandoCard', 'editarForm', 'right');
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
                    this.getApplication().getController('Pedido').pagarOk(nroatencion);
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
        var valorPago = 0.0;
        Ext.getStore('Pedido').each(function(record, index, length){
            valorPedido += record.get('cantidad')*record.get('precio')
        }, this)
        Ext.getStore('Pago').each(function(item){
            valorPago += item.get('valorpago')
        });

        if(valorPago==0.0) {
            mensaje = 'La cuenta se pagara con el monto exacto, desea continuar?';
        } else if((valorPedido-valorPago)>0) {
            Ext.Msg.alert('Advertencia', 'Debe terminar de pagar la cuenta', Ext.emptyFn);
            return;
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
                                this.getApplication().getController('Pedido').imprimirTiket(text.data.id);
                                Ext.getStore('Pago').removeAll();
                                Ext.getStore('Pedido').removeAll();
                                this.getApplication().getController('Pedido').getTotalesView().down('label[name=lblTotalItems]').setHtml('TOTAL ITEMS: 0');
                                this.getApplication().getController('Pedido').getSeleccionView().down('button[name=lblTotalMonto]').setText(rewpos.AppGlobals.MONEDA_SIMBOLO+'0.00');
                                if(rewpos.AppGlobals.PRODUCTO_TOUCH) {
                                    rewpos.Util.showPanel('productosCard', 'categoriaDataView', 'left');
                                } else {
                                    rewpos.Util.showPanel('comandoCard', 'productoView', 'left');
                                }
                                
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
    imprimirTiket: function(id){
        rewpos.Util.mask('imprimiendo comprobante, porfavor espere.', true);
        Ext.Ajax.request({
            url: rewpos.AppGlobals.HOST_PRINT+'print/factura/'+id,
            callback: function(request, success, response){
                rewpos.Util.unmask(true);
                if(success){
                    var text = Ext.JSON.decode(response.responseText);
                    console.log(text);
                    if(!text.success) {
                        this.getApplication().getController('Pedido').imprimirTiketQ(id);
                    }
                } else {
                    this.getApplication().getController('Pedido').imprimirTiketQ(id);
                }
            }
        });
    },
    imprimirTiketQ: function(id) {
        Ext.Msg.show({
            title: "Confirmacion",
            message: rewpos.AppGlobals.MSG_PRINTER_ERROR+"\nReintentar Impresion?",
            buttons:  [{
                itemId: 'no',
                text: 'Cancelar'
            },{
                itemId: 'yes',
                text: 'Reintentar'
            }],
            fn: function(btn) {
                if(btn=='yes'){
                    this.imprimirTiket(id);
                }
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
                        var modal = Ext.Viewport.add({xtype: 'autorizacionModal'});
                        var btnOk = modal.down('button[action=ok]');
                        var cbo = modal.down('selectfield[name=cboAdministradores]');
                        var pass = modal.down('passwordfield[name=passwordLoginAdmin]');
                        btnOk.addListener('tap', function(btn){
                            var adminId = cbo.getValue();
                            if(adminId>0) {
                                var pass1 = rewpos.Util.MD5(pass.getValue()).toUpperCase();
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
                                                this.getApplication().getController('Pedido').getTotalesView().down('label[name=lblTotalItems]').setHtml('TOTAL ITEMS: 0');
                                                this.getApplication().getController('Pedido').getSeleccionView().down('button[name=lblTotalMonto]').setText(rewpos.AppGlobals.MONEDA_SIMBOLO+'0.00');
                                                if(rewpos.AppGlobals.PRODUCTO_TOUCH) {
                                                    rewpos.Util.showPanel('comandoCard', 'productoTouchView', 'left');
                                                    rewpos.Util.showPanel('productosCard', 'categoriaDataView', 'left');
                                                } else {
                                                    rewpos.Util.showPanel('comandoCard', 'productoView', 'left');
                                                }
                                                Ext.Ajax.request({
                                                    url: rewpos.AppGlobals.HOST_PRINT+'print/pedido/liberar/'+res.data.id,
                                                    callback: function(request, success, response){
                                                        if(success){
                                                            var text = Ext.JSON.decode(response.responseText);
                                                            if(!text.success) {
                                                                Ext.Msg.alert('Advertencia', 'Error al imprimir LIBERADO', Ext.emptyFn);
                                                            }
                                                        }else{
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
                                    pass.setValue('');
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
            var modal = Ext.Viewport.add({xtype: 'cambiarMesaModal'});
            var mesaOrigen = modal.down('numberfield[name=mesaOrigen]');
            var mesaDestino = modal.down('numberfield[name=mesaDestino]');
            var btnOk = modal.down('button[action=ok]');
            modal.down('label[name=titulo]').setHtml('Cambiar Mesa');
            mesaOrigen.setValue(nroatencion);
            btnOk.addListener('tap', function(){
                var nrodestino = mesaDestino.getValue() || 0;
                if(nrodestino==nroatencion) {
                    Ext.Msg.alert('Advertencia', 'La mesa de destino no debe ser igual a la de origen', Ext.emptyFn);
                    mesaDestino.setValue('');
                    return;
                }
                //nrodestino = text; //Ext.data.Types.NUMBER.convert(text)
                //Ext.isNumber(nrodestino)
                if(nrodestino>=1 && nrodestino<=rewpos.AppGlobals.MAX_MESAS) {
                    
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
                                Ext.Viewport.remove(btnOk.up('panel'));
                                this.getApplication().getController('Pedido').getSeleccionView().down('button[name=btnSeleccionMesa]').setText('M: '+nrodestino);
                            } else {
                                mesaDestino.setValue('');
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
                    mesaDestino.setValue('');
                }
            });
        } else {
            Ext.Msg.alert('', 'No hay un mesa para cambiar', Ext.emptyFn);
        }
    },
    unir: function() {
        Ext.Viewport.toggleMenu('right');
        if(Ext.getStore('Pedido').getCount()>0){
            var nroatencion = Ext.getStore('Pedido').getAt(0).get('nroatencion');
            var modal = Ext.Viewport.add({xtype: 'cambiarMesaModal'});
            var mesaOrigen = modal.down('numberfield[name=mesaOrigen]');
            var mesaDestino = modal.down('numberfield[name=mesaDestino]');
            var btnOk = modal.down('button[action=ok]');
            modal.down('label[name=titulo]').setHtml('Unir Mesa');
            mesaOrigen.setValue(nroatencion);
            btnOk.addListener('tap', function(){
                var nrodestino = mesaDestino.getValue() || 0;
                if(nrodestino==nroatencion) {
                    Ext.Msg.alert('Advertencia', 'La mesa de destino no debe ser igual a la de origen', Ext.emptyFn);
                    mesaDestino.setValue('');
                    return;
                }
                if(nrodestino>=1 && nrodestino<=rewpos.AppGlobals.MAX_MESAS) {
                    
                    rewpos.Util.mask();
                    Ext.Ajax.request({
                        url: rewpos.AppGlobals.HOST+'pedido/unir',
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
                                Ext.Viewport.remove(btnOk.up('panel'));
                                this.getApplication().getController('Mesas').loadPedido(nrodestino);
                            } else {
                                mesaDestino.setValue('');
                                if(res.error=='destinovacio') {
                                    Ext.Msg.alert('Advertencia', 'La mesa de destino esta vacia', Ext.emptyFn);
                                }else{
                                    Ext.Msg.alert('Advertencia', 'Error al unir mesa', Ext.emptyFn);
                                }
                            }
                        }
                    });
                } else {
                    Ext.Msg.alert('Advertencia', 'Debe ingresar un numero de mesa valido entre 1 y 100', Ext.emptyFn);
                    mesaDestino.setValue('');
                }
            });
        } else {
            Ext.Msg.alert('', 'No hay un mesa para unir', Ext.emptyFn);
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
        var cajeroId = rewpos.AppGlobals.USUARIO.get('id');
        Ext.Ajax.request({
            url: rewpos.AppGlobals.HOST+'pedido/resumen/'+cajaId+'/'+cajeroId,
            callback: function(request, success, response){
                rewpos.Util.unmask();
                var text = Ext.JSON.decode(response.responseText);
                var atenciones = text.data[0].Atenciones || 0;
                var atenciones = Ext.data.Types.NUMBER.convert(atenciones);
                var ventas = text.data[0].Ventas || 0;
                var ventas = Ext.data.Types.NUMBER.convert(ventas);
                var total = atenciones+ventas;

                var atenciones = rewpos.Util.formatValue(atenciones);
                var ventas = rewpos.Util.formatValue(ventas);
                var total = rewpos.Util.formatValue(total);
                var cajero = rewpos.AppGlobals.USUARIO.get('nombre')+' '+rewpos.AppGlobals.USUARIO.get('apellido');
                Ext.Msg.show({
                    title: 'Resumen Diario - '+cajero, 
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
    anularDocumento: function() {
        Ext.Viewport.toggleMenu('right');
        Ext.Viewport.add({xtype: 'anularDocumentoModal'});
    },
    cierreParcial: function() {
        Ext.Viewport.toggleMenu('right');
        var modal = Ext.Viewport.add({xtype: 'autorizacionModal'});
        var cbo = modal.down('selectfield[name=cboAdministradores]');
        var pass = modal.down('passwordfield[name=passwordLoginAdmin]');
        var btnOk = modal.down('button[action=ok]');
        btnOk.addListener('tap', function(btn){
            var adminId = cbo.getValue();
            if(adminId>0) {
                var pass1 = rewpos.Util.MD5(pass.getValue()).toUpperCase();
                var pass2 = Ext.getStore('Usuario').findRecord('id', adminId).get('clave').toUpperCase();
                if(pass1==pass2){
                    Ext.Viewport.remove(btnOk.up('panel'));
                    rewpos.Util.mask();
                    var cajaId;
                    var urlCierre;
                    if(rewpos.AppGlobals.USUARIO==null){
                        var centrocostoId = Ext.getStore('Usuario').findRecord('id', adminId).get('centrocosto_id')
                        var urlCaja = Ext.getStore('Caja').getProxy().getUrl()+'/'+centrocostoId;
                        Ext.getStore('Caja').load({
                            url: urlCaja,
                            callback: function(records, operation, success) {
                                if(records.length==1){
                                    cajaId = records[0].get('id');
                                    urlCierre = rewpos.AppGlobals.HOST_PRINT+'print/cierre/'+cajaId;
                                    Ext.Ajax.request({
                                        url: urlCierre,
                                        callback: function(request, success, response){
                                            if(success){
                                                var text = Ext.JSON.decode(response.responseText);
                                                if(text.success) {
                                                    Ext.Ajax.request({
                                                        url: rewpos.AppGlobals.HOST+'caja/cierre/'+cajaId,
                                                        callback: function(request, success, response) {

                                                        }
                                                    });
                                                } else {
                                                    Ext.Msg.alert('Advertencia', 'Error en CIERRE', Ext.emptyFn);
                                                }
                                            } else {
                                                Ext.Msg.alert('Advertencia', rewpos.AppGlobals.MSG_PRINTER_ERROR, Ext.emptyFn);
                                            }
                                        }
                                    });
                                } else {
                                    Ext.Array.forEach(records, function(item) {
                                        
                                    }, this);
                                }
                            },
                            scope: this
                        })
                        urlCierre = rewpos.AppGlobals.HOST_PRINT+'print/cierre/'+cajaId;
                    } else {
                        cajaId = rewpos.AppGlobals.CAJA.get('id');
                        var cajeroId = rewpos.AppGlobals.USUARIO.get('id');
                        urlCierre = rewpos.AppGlobals.HOST_PRINT+'print/cierre/'+cajaId+'/'+cajeroId
                        Ext.Ajax.request({
                            url: urlCierre,
                            callback: function(request, success, response){
                                var text = Ext.JSON.decode(response.responseText);
                                if(!text.success) {
                                    Ext.Msg.alert('Advertencia', 'Error en cierre PARCIAL', Ext.emptyFn);
                                }
                            }
                        });
                    }
                } else {
                    pass.setValue('');
                    Ext.Msg.alert('Advertencia', 'Clave incorrecta', Ext.emptyFn);
                }
            } else {
                Ext.Msg.alert('Advertencia', 'Elija un administrador', Ext.emptyFn);
            }
        });
    }
});