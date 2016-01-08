Ext.define('rewpos.controller.Pedido', {
    extend: 'Ext.app.Controller',
    config: {
        stores: ['Mesa','Pedido','Categoria','Producto', 'Cajero', 'Admin','Hijo'],
        models: ['Mesa','Pedido','Categoria','Producto','Hijo'],
        refs: {
            editarForm: 'editarForm',
            editarFormMultiSelectedField: 'editarForm multiselectfield',
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
                //select: 'onSelectPedidoList',
                itemtap: 'onItemTapPedidoList'
            }
        } 
    },
    onActivate: function(view){
        if(rewpos.AppGlobals.CAJA.get('tipo')=='C') {
            Ext.Viewport.setMenu(rewpos.Menu.CAJA, {
                side: 'right',
                reveal: false,
                cover: false
            });
        } else {
            Ext.Viewport.setMenu(rewpos.Menu.PEDIDO, {
                side: 'right',
                reveal: false,
                cover: false
            });
        }
    },
    ontapSeleccion: function(btn) {
        switch(btn.getItemId()) {
            case 'btnSeleccionMesa':
                Ext.getStore('Mesa').getProxy().setUrl(rewpos.AppGlobals.HOST+'mesa/'+rewpos.AppGlobals.CAJA_ID);
                Ext.getStore('Mesa').load();
                this.getToolbarView().down('button[name=backToPedido]').setHidden(false);
                this.getToolbarView().down('button[name=backToPedido]').setText('MESA: '+btn.getText().substr(3));
                rewpos.Util.showPanel('mainCard', 'mesasView', 'left');
                break;
            case 'lblTotalMonto':
                //Ext.data.Types.NUMBER.convert(btn.getText().substr(4))<=0
                if(Ext.getStore('Pedido').getCount()>0 && rewpos.AppGlobals.CAJA.get('tipo')=='C') {
                    var nroatencion = Ext.getStore('Pedido').getAt(0).get('nroatencion');
                    var cliente = Ext.getStore('Pedido').getAt(0).get('cliente_name');

                    if(cliente=='' || cliente==null) {
                        this.getPagosView().down('button[name=btnCliente]').setText('Cliente');
                    } else {
                        var cliente_id = Ext.getStore('Pedido').getAt(0).get('cliente_id');
                        Ext.ModelManager.getModel('rewpos.model.Cliente').load(cliente_id,{
                            callback: function(record, operation) {
                                //console.log(record);
                                var cliente = record.get('nombre')+"<br>";
                                cliente += record.get('ruc')+"<br>";
                                cliente += record.get('direccion')+"-"+record.get('ubigeo_name');
                                this.getPagosView().down('button[name=btnCliente]').setHtml(cliente);
                            },
                            scope: this
                        });
                    }
                    Ext.getStore('Pago').load({
                        url: rewpos.AppGlobals.HOST+'pedido/pago/'+nroatencion+'/'+rewpos.AppGlobals.CAJA_ID,
                        callback: function() {
                            var montoPagar = 0;
                            Ext.getStore('Pedido').each(function(item){
                                montoPagar += item.get('cantidad')*item.get('precio');
                            });
                            var dscto_m = Ext.getStore('Pedido').getAt(0).get('dscto_m');
                            var dscto_p = Ext.getStore('Pedido').getAt(0).get('dscto_p');
                            var dscto_id = Ext.getStore('Pedido').getAt(0).get('descuento_tipo_id');
                            var dscto_name = Ext.getStore('Pedido').getAt(0).get('descuento_tipo_name');
                            this.getApplication().getController('Pagos').setDescuento(dscto_id, dscto_name, montoPagar, dscto_m, dscto_p, function(){
                                rewpos.Util.showPanel('comandoCard', 'pagosView', 'right');
                            }, "", "");
                        },
                        scope: this
                    });
                }
                break;
        }
    },
    onChangeCbo: function(cbo, newValue, oldValue) {
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
                    caja_id: rewpos.AppGlobals.CAJA_ID,
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
        /*if(rewpos.AppGlobals.LIST_SELECTED==null) return;
        if(rewpos.AppGlobals.LIST_SELECTED.getId()=='pedidoList'){
            this.onItemTapPedidoList(list, null, null, record);
        }*/
    },
    onItemTapPedidoList: function(list, index, target, record) {
        rewpos.AppGlobals.LIST_SELECTED = list;
        this.getEditarForm().setRecord(record);
        var nroatencion = Ext.getStore('Pedido').getAt(0).get('nroatencion');
        var productoId = record.get("producto_id");
        //console.log(nroatencion);
        //console.log('PASO');
        Ext.getStore('Hijo').load({
            url: rewpos.AppGlobals.HOST+'producto/hijos/'+nroatencion+'/'+productoId,
            callback: function(record) {
                var check = [];
                for (var i = 0; i < record.length; i++) {
                    if(record[i].get("check")){
                        check.push(record[i].get("id"));
                    }
                };
                if(record.length>0){
                    this.getEditarFormMultiSelectedField().setHidden(false);
                    this.getEditarFormMultiSelectedField().setValue(check);
                }else{
                    this.getEditarFormMultiSelectedField().setHidden(true);
                }
                rewpos.Util.showPanel('comandoCard', 'editarForm', 'right');
            },
            scope: this
        });
    },
    pagar: function(ticket){
        if(Ext.typeOf(ticket)=="object"){
            ticket = false;
        }
        if(!ticket){
            Ext.Viewport.toggleMenu('right');
        }
       /* if(rewpos.AppGlobals.DEBUG) {
            Ext.Msg.alert('Advertencia', 'No se puede realizar pagos en modo DEBUG', Ext.emptyFn);
            return;
        }*/
        if(Ext.getStore('Pedido').getCount()>0){
            var nroatencion = Ext.getStore('Pedido').getAt(0).get('nroatencion');
            /*if(this.getPagosView().down('segmentedbutton').getPressedButtons()[0].getText()=='OTROS'){
                if(Ext.getStore('Pedido').getAt(0).get('cliente_id')>0) {
                    
                }
            }*/
            //return;
            Ext.getStore('Pago').load({
                url: rewpos.AppGlobals.HOST+'pedido/pago/'+nroatencion+'/'+rewpos.AppGlobals.CAJA_ID,
                callback: function() {
                    this.pagarOk(nroatencion, ticket);
                },
                scope: this
            });
            /*rewpos.Util.mask();
            Ext.Ajax.request({
                url: rewpos.AppGlobals.HOST+'pedido/actualizar/debug',
                method: 'POST',
                params: {
                    nroatencion: nroatencion,
                    caja_id: rewpos.AppGlobals.CAJA_ID,
                    cajero_id: rewpos.AppGlobals.CAJERO.get('id')
                },
                callback: function(){
                    rewpos.Util.unmask();
                    this.pagarOk(nroatencion);
                },
                scope: this
            });*/
        } else {
            Ext.Msg.alert('', 'No hay un pedido para procesar', Ext.emptyFn);
        }
    },
    pagarOk: function(nroatencion, ticket) {
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
            if(item.get('moneda_id')==2){
                valorPago += item.get('valorpago')*rewpos.AppGlobals.TIPO_CAMBIO;
            }else{
                valorPago += item.get('valorpago');
            }
        });
        var dscto_m = Ext.getStore('Pedido').getAt(0).get('dscto_m');
        console.log(valorPedido);
        console.log(dscto_m);
        console.log(valorPago);
        if(valorPago==0.0) {
            mensaje = 'La cuenta se pagara con el monto exacto, desea continuar?';
        } else if(((valorPedido-dscto_m)-valorPago)>0) {
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
                    rewpos.Util.mask('Procesando...', true);
                    Ext.Ajax.request({
                        url: rewpos.AppGlobals.HOST+'pedido/pagar',
                        method: 'POST',
                        params: {
                            nroatencion: nroatencion,
                            caja_id: rewpos.AppGlobals.CAJA_ID,
                            cajero_id: rewpos.AppGlobals.CAJERO.get('id'),
                            ticket: ticket
                        },
                        callback: function(request, success, response){
                            rewpos.Util.unmask(true);
                            var text = Ext.JSON.decode(response.responseText);
                            if(text.success){
                                Ext.getStore('Pago').removeAll();
                                Ext.getStore('Pedido').removeAll();
                                this.getSeleccionView().down('selectfield[name=cboMozos]').setValue(0);
                                this.getSeleccionView().down('selectfield[name=cboPax]').setValue(1);
                                this.getTotalesView().down('label[name=lblTotalItems]').setHtml('TOTAL ITEMS: 0');
                                this.getSeleccionView().down('button[name=lblTotalMonto]').setText(rewpos.AppGlobals.MONEDA_SIMBOLO+'0.00');
                                //console.log(rewpos.AppGlobals.PRODUCTO_TOUCH);
                                if(rewpos.AppGlobals.PRODUCTO_TOUCH) {
                                    //rewpos.Util.showPanel('productosCard', 'categoriaDataView', 'left');
                                    rewpos.Util.showPanel('comandoCard', 'productoTouchView', 'left');
                                    rewpos.Util.showPanel('productosCard', 'categoriaDataView', 'left');
                                    //rewpos.Util.showPanel('comandoCard', 'productoTouchView', 'left');
                                    //rewpos.Util.showPanel('comandoCard', 'categoriaDataView', 'left');
                                } else {
                                    rewpos.Util.showPanel('comandoCard', 'productoView', 'left');
                                }
                                this.imprimirTiket(text.data.id, ticket);
                            } else {
                                Ext.Msg.alert('Advertencia', 'Error al pagar la cuenta', Ext.emptyFn);
                            }
                        },
                        scope: this
                    });
                }
            },
            scope: this
        });
    },
    imprimirTiket: function(id, ticket){
        rewpos.Util.mask('imprimiendo comprobante, porfavor espere.', true);
        Ext.ModelManager.getModel('rewpos.model.Imprimir').load("comprobante/"+id+"/"+ticket,{
            callback: function(record, operation) {
                rewpos.Util.unmask(true);
                if(!record.get('success')){
                    this.imprimirTiketQ(id, ticket);
                }
            },
            scope: this
        });
        /*Ext.Ajax.request({
            url: rewpos.AppGlobals.HOST_PRINT+'factura/'+id,
            disableCaching: false,
            useDefaultXhrHeader: false,
            callback: function(request, success, response){
                rewpos.Util.unmask(true);
                if(success){
                    var text = Ext.JSON.decode(response.responseText);
                    if(!text.success) {
                        this.imprimirTiketQ(id);
                    }
                } else {
                    this.imprimirTiketQ(id);
                }
            },
            scope: this
        });*/
    },
    imprimirTiketQ: function(id, ticket) {
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
                    this.imprimirTiket(id, ticket);
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
            var modal = Ext.Viewport.add({xtype: 'autorizacionModal'});
            var btnOk = modal.down('button[action=ok]');
            var cbo = modal.down('selectfield[name=cboAdministradores]');
            var pass = modal.down('passwordfield[name=passwordLoginAdmin]');
            btnOk.addListener('tap', function(btn){
                var adminId = cbo.getValue();
                if(adminId>0) {
                    var pass1 = rewpos.Util.MD5(pass.getValue()).toUpperCase();
                    var pass2 = Ext.getStore('Admin').findRecord('id', adminId).get('clave').toUpperCase();
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
                                    if(rewpos.AppGlobals.PRODUCTO_TOUCH) {
                                        rewpos.Util.showPanel('comandoCard', 'productoTouchView', 'left');
                                        rewpos.Util.showPanel('productosCard', 'categoriaDataView', 'left');
                                    } else {
                                        rewpos.Util.showPanel('comandoCard', 'productoView', 'left');
                                    }
                                    Ext.ModelManager.getModel('rewpos.model.Imprimir').load('pedido/liberar/'+res.data.id,{
                                        callback: function(record, operation) {
                                        },
                                        scope: this
                                    });
                                    
                                    /*Ext.Ajax.request({
                                        url: rewpos.AppGlobals.HOST_PRINT+'pedido/liberar/'+res.data.id,
                                        disableCaching: false,
                                        useDefaultXhrHeader: false,
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
                                    });*/
                                } else {
                                    Ext.Msg.alert('Advertencia', 'Error al liberar la mesa', Ext.emptyFn);
                                }
                            }
                        });
                        this.getApplication().getController('Pedido').getTotalesView().down('label[name=lblTotalItems]').setHtml('TOTAL ITEMS: 0');
                        this.getApplication().getController('Pedido').getSeleccionView().down('button[name=lblTotalMonto]').setText(rewpos.AppGlobals.MONEDA_SIMBOLO+'0.00');
                    } else {
                        pass.setValue('');
                        Ext.Msg.alert('Advertencia', 'Clave incorrecta', Ext.emptyFn);
                    }
                } else {
                    Ext.Msg.alert('Advertencia', 'Elija un administrador', Ext.emptyFn);
                }
            }, this);
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
                                this.getSeleccionView().down('button[name=btnSeleccionMesa]').setText('M: '+nrodestino);
                            } else {
                                mesaDestino.setValue('');
                                if(res.error=='destinoexiste') {
                                    Ext.Msg.alert('Advertencia', 'La mesa de destino esta ocupada', Ext.emptyFn);
                                }else{
                                    Ext.Msg.alert('Advertencia', 'Error al cambiar mesa', Ext.emptyFn);
                                }
                            }
                        },
                        scope: this
                    });
                } else {
                    Ext.Msg.alert('Advertencia', 'Debe ingresar un numero de mesa valido entre 1 y 100', Ext.emptyFn);
                    mesaDestino.setValue('');
                }
            }, this);
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
                        },
                        scope: this
                    });
                } else {
                    Ext.Msg.alert('Advertencia', 'Debe ingresar un numero de mesa valido entre 1 y 100', Ext.emptyFn);
                    mesaDestino.setValue('');
                }
            }, this);
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
        var cajaId = rewpos.AppGlobals.CAJA_ID;
        var cajeroId = rewpos.AppGlobals.CAJERO.get('id');
        Ext.Ajax.request({
            url: rewpos.AppGlobals.HOST+'pedido/resumen/cc/'+cajaId+'/'+cajeroId,
            callback: function(request, success, response){
                rewpos.Util.unmask();
                var text = Ext.JSON.decode(response.responseText);
                var records = text.data, record = null;
                var usuario, total, totales = 0, msg = "";
                for(i in records){
                    record = records[i];
                    usuario = record.usuario;
                    total = Ext.data.Types.NUMBER.convert(record.total || 0);
                    totales += total;
                    total = rewpos.Util.formatValue(total);
                    msg += '<div class="titulo">'+usuario+'</div><div class="valor">'+total+'</div><br/>';
                }
                /*var atenciones = Ext.data.Types.NUMBER.convert(text.data[0].Atenciones || 0);
                var ventas = Ext.data.Types.NUMBER.convert(text.data[0].Ventas || 0);
                var total = atenciones+ventas;

                var atenciones = rewpos.Util.formatValue(atenciones);
                var ventas = rewpos.Util.formatValue(ventas);*/
                var totales = rewpos.Util.formatValue(totales);
                //var cajero = rewpos.AppGlobals.CAJERO.get('nombre')+' '+rewpos.AppGlobals.CAJERO.get('apellido');
                Ext.Msg.show({
                    //title: 'Resumen Diario - '+cajero,
                    title: 'Resumen Diario',
                    message: '<div id="resumenMessage">'+
                    msg+
                    '-----------------------------------------------------------<br/>'+
                    '<div class="titulo">Total:</div><div class="valor">'+totales+'</div>'+
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
                var pass2 = Ext.getStore('Admin').findRecord('id', adminId).get('clave').toUpperCase();
                if(pass1==pass2){
                    Ext.Viewport.remove(btnOk.up('panel'));
                    rewpos.Util.mask();
                    var cajaId = rewpos.AppGlobals.CAJA_ID;
                    //var urlCierre;
                    if(rewpos.AppGlobals.CAJERO==null){
                        Ext.ModelManager.getModel('rewpos.model.Imprimir').load('cierre_pre/'+cajaId, {
                            callback: function(record, operation) {
                                if(record.get("error")){
                                    Ext.Msg.alert('Advertencia', record.get("message"), Ext.emptyFn);
                                }else{
                                    Ext.Msg.show({
                                        title: "Confirmacion",
                                        message: "Desea emitir el CIERRE Z",
                                        buttons:  [{
                                            itemId: 'no',
                                            text: 'No'
                                        },{
                                            itemId: 'yes',
                                            text: 'Si'
                                        }],
                                        fn: function(btn) {
                                            if(btn=='yes'){
                                                Ext.ModelManager.getModel('rewpos.model.Imprimir').load('cierre/'+cajaId, {
                                                    callback: function(record, operation) {
                                                        if(record.get("error")){
                                                            Ext.Msg.alert('Advertencia', record.get("message"), Ext.emptyFn);
                                                        }else{
                                                            Ext.Ajax.request({
                                                                url: rewpos.AppGlobals.HOST+'caja/cierre/'+cajaId,
                                                                callback: function(request, success, response) {
                                                                    rewpos.Util.unmask();
                                                                }
                                                            });
                                                        }
                                                    },
                                                    scope: this
                                                });
                                            }
                                        },
                                        scope: this
                                    });
                                }
                            },
                            scope: this
                        });

                        //urlCierre = rewpos.AppGlobals.HOST_PRINT+'cierre/'+cajaId;
                    } else {
                        var cajeroId = rewpos.AppGlobals.CAJERO.get('id');
                        Ext.ModelManager.getModel('rewpos.model.Imprimir').load('cierre/'+cajaId+'/'+cajeroId,{
                            callback: function(record, operation) {
                                rewpos.Util.unmask();
                            },
                            scope: this
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