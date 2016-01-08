Ext.define('rewpos.controller.ClienteModal', {
    extend: 'Ext.app.Controller',
    config: {
        stores: ['Ubigeo', 'Pedido', 'Cliente'],
        models: ['Ubigeo','Cliente'],
        refs: {
            clienteModal: 'clienteModal',
            pagosView: 'pagosView',
            clientesList: 'clienteBuscarModal list',
            txtRuc: 'clienteModal searchfield[name=ruc]',
            txtRs: 'clienteModal textfield[name=nombre]'
        },
        control: {
            'clienteModal': {
                initialize: 'onInitialize'
            },
            'clienteModal searchfield': {
                focus: 'onFocusBuscar',
                action: 'onSearchAction',
                blur: 'onSearchActionBlur',
                clearicontap: 'onSearchClearIconTap'
            },
            'clienteModal button': {
                tap: 'onTapButton'
            },
            'clienteModal selectfield': {
                change: 'onChangeSelectfield'
            },
            'clienteBuscarModal': {
                initialize: 'onInitializeBuscar'
            },
            'clienteBuscarModal searchfield': {
                focus: 'onFocusBuscar',
                action: 'onSearchAction2',
                clearicontap: 'onSearchClearIconTap2'
            },
            'clienteBuscarModal list': {
                //itemdoubletap: 'onItemDoubleTapClienteList'
                itemtap: 'onItemDoubleTapClienteList'
            },
            'clienteBuscarModal button': {
                //itemdoubletap: 'onItemDoubleTapClienteList'
                itemtap: 'onItemDoubleTapClienteList'
            }
        } 
    },
    cargado: false,
    onChangeSelectfield: function(cbo, newValue, oldValue, e){
        var dep = this.getClienteModal().down('selectfield[name=departamento_id]').getValue();
        var pro = this.getClienteModal().down('selectfield[name=provincia_id]').getValue();
        var dis = this.getClienteModal().down('selectfield[name=ubigeo_id]').getValue();
        if(dep && pro && dis){
            console.log("onChangeSelectfield");
            if(cbo.getName()=='departamento_id'){
                this.loadProvincias(newValue);
            }
            if(cbo.getName()=='provincia_id'){
                var dep_id = this.getClienteModal().down('selectfield[name=departamento_id]').getValue();
                this.loadDistrito(dep_id, newValue);
            }
        }
    },
    loadDepartamentos: function(dep_id, cb) {
        var dep = new Array();
        Ext.getStore('Ubigeo').load({
            url: rewpos.AppGlobals.HOST+'ubigeo',
            callback: function(records) {
                Ext.Array.forEach(records, function(record) {
                    dep.push({text: record.get('nombre'), value: record.get('id')})
                });
                this.getClienteModal().down('selectfield[name=departamento_id]').setOptions(dep);
                if(dep_id){
                    this.getClienteModal().down('selectfield[name=departamento_id]').setValue(dep_id);
                }
                if(cb){
                    cb();
                }
            },
            scope: this
        });
    },
    loadProvincias: function(dep_id, pro_id, cb){
        var pro = new Array();
        Ext.getStore('Ubigeo').load({
            url: rewpos.AppGlobals.HOST+'ubigeo/'+dep_id,
            callback: function(records) {
                Ext.Array.forEach(records, function(record) {
                    pro.push({text: record.get('nombre'), value: record.get('id')})
                });
                this.getClienteModal().down('selectfield[name=provincia_id]').setOptions(pro);
                if(pro_id){
                    this.getClienteModal().down('selectfield[name=provincia_id]').setValue(pro_id);
                }
                if(cb){
                    cb();
                }
            },
            scope: this
        });
    },
    loadDistrito: function(dep_id, pro_id, dis_id, cb){
        var dis = new Array();
        Ext.getStore('Ubigeo').load({
            url: rewpos.AppGlobals.HOST+'ubigeo/'+dep_id+'/'+pro_id,
            callback: function(records) {
                Ext.Array.forEach(records, function(record) {
                    dis.push({text: record.get('nombre'), value: record.get('id')})
                });
                this.getClienteModal().down('selectfield[name=ubigeo_id]').setOptions(dis);
                /*if(dis_id){
                    this.getClienteModal().down('selectfield[name=ubigeo_id]').setValue(dis_id);
                }*/
                //this.cargado = true;
                console.log("loadDistrito: "+this.cargado);
                if(cb){
                    cb();
                }
            },
            scope: this
        });
    },
    loadUbigeo: function(){
        // dep_id = 1392; pro_id = 1393;dis_id = 1394;
    },
    onInitialize: function(view) {
        this.cargado = false;
        if(Ext.getStore('Pedido').getCount()>0) {
            var ubigeo = new Array();
            var clienteId = Ext.getStore('Pedido').getAt(0).get('cliente_id');
            if(clienteId>0){
                Ext.ModelManager.getModel('rewpos.model.Cliente').load(clienteId,{
                    callback: function(record, operation) {
                        var form = this.getClienteModal();
                        if(record) {
                            this.loadDepartamentos(record.get('departamento_id'),
                                this.loadProvincias(record.get('departamento_id'), record.get('provincia_id'),
                                    this.loadDistrito(record.get('departamento_id'), record.get('provincia_id'), record.get('ubigeo_id'), function(){
                                        form.setRecord(record);
                                    })
                                )
                            );
                            
                            //form.setRecord(record);
                        } else {
                            //this.loadUbigeo();
                            form.setRecord(Ext.create('rewpos.model.Cliente',{id: null})); //, ubigeo_id: "1393"
                            form.down('textfield[name=ruc]').focus();
                        }
                    },
                    scope: this
                });
            }
        }
    },
    onSearchActionBlur: function(field, e) {
        this.onSearchAction(field, e);
    },
    onSearchAction: function(field, e) {
        var form = this.getClienteModal();
        var value = field.getValue();
        if(value.length==0) {

        }
        if(value.length==11 || value.length==8) {
            Ext.ModelManager.getModel('rewpos.model.Cliente').load('ruc/'+value,{
                callback: function(record, operation) {
                    console.log(record);
                    if(record) {
                        form.setRecord(record);
                    } else {
                        form.setRecord(Ext.create('rewpos.model.Cliente',{ruc: value, id: null, ubigeo_id: "1393"}));
                        form.down('textfield[name=nombre]').focus();
                    }
                },
                scope: this
            });
        }
    },
    onSearchClearIconTap: function() {
        var form = this.getClienteModal();
        form.setRecord(Ext.create('rewpos.model.Cliente',{id: null, ubigeo_id: "1393"}));
    },
    onTapButton: function(btn) {
        switch(btn.getItemId()){
            case 'cancelar':
                Ext.Viewport.remove(btn.up('panel'));
                break;
            case 'aceptar':
                this.onBtnAceptar(btn);
                break;
        }
    },
    onBtnAceptar: function(btn) {
        var form = this.getClienteModal();

        var fields = form.query("field");
        for (var i=0; i<fields.length; i++) {
            fields[i].removeCls('invalidField');
        }
        var values = form.getValues();
        var ruc = values.ruc;
        if(ruc.length==11 || ruc.length==8) {

        } else {
            Ext.Msg.alert('Advertencia', 'RUC invalido<br> el RUC debe contener 11 caracteres, en caso de DNI debe contener 8');
            return;
        }

        var record = form.getRecord();
        values.ubigeo_name = this.getClienteModal().down('selectfield[name=ubigeo_id]').getRecord().get('text');
        record.set(values);
        var errors = record.validate();
        var errorString = '';
        function getLabel(campo) {
            switch(campo){
                case 'ruc':
                    return 'RUC';
                    break;
                case 'nombre':
                    return 'Razon Social';
                    break;
            }
        }
        if(!errors.isValid()) {
            errors.each(function (errorObj){
                errorString += getLabel(errorObj.getField())+"<br>";
                var s = Ext.String.format('field[name={0}]',errorObj.getField());
                form.down(s).addCls('invalidField');
            });
            Ext.Msg.alert('Advertencia', 'Debe ingresar los siguientes campos: <br>'+errorString);
        } else {
            rewpos.Util.mask();
            record.save({
                callback: function(record, operation) {
                    console.log(record);
                    this.updateCliente(btn,  record.get('id'), record);
                }
            }, this);
        }
    },
    /*setTextBtnCliente: function(nombre, ruc, direccion){
        var cliente = nombre+"<br>";
        cliente += ruc+"<br>";
        cliente += direccion;
        this.getPagosView().down('button[name=btnCliente]').setHtml(cliente);
    },*/
    updateCliente: function(btn, cliente_id, record) {
        var nroatencion = Ext.getStore('Pedido').getAt(0).get('nroatencion');
        Ext.Ajax.request({
            url: rewpos.AppGlobals.HOST+'pedido/actualizar/cliente',
            method: 'POST',
            params: {
                nroatencion: nroatencion,
                clienteId: cliente_id
            },
            callback: function(){
                rewpos.Util.unmask();
                var cliente = record.get('nombre')+"<br>";
                cliente += record.get('ruc')+"<br>";
                cliente += record.get('direccion')+"-"+record.get('ubigeo_name');
                this.getPagosView().down('button[name=btnCliente]').setHtml(cliente);
                //this.setTextBtnCliente(record.get('nombre'), record.get('ruc'), record.get('direccion')+"-"+record.get('ubigeo_name'));

                Ext.getStore('Pedido').each(function(pedido){
                    pedido.set('cliente_id', cliente_id);
                    pedido.set('cliente_name', record.get('nombre'));
                });
                Ext.Viewport.remove(btn.up('panel'));
            },
            scope: this
        });
    },
    onInitializeBuscar: function() {
        Ext.getStore('Cliente').removeAll();
    },
    onSearchAction2: function(field) {
        var value = field.getValue();
        if (value.length>0) {
            rewpos.Util.mask('Buscando...', true);
            Ext.getStore('Cliente').load({
                url: rewpos.AppGlobals.HOST+'cliente/buscar/'+value,
                callback: function(records) {
                    console.log(records);
                    rewpos.Util.unmask(true);
                    if(records.length>0){
                        this.getClientesList().select(0);
                        rewpos.AppGlobals.LIST_SELECTED = this.getClientesList();
                    } else {
                        Ext.Viewport.remove(field.up('panel'));
                        Ext.Viewport.add({xtype: 'clienteModal', scrollable: false});
                        var form = this.getClienteModal();
                        this.loadDepartamentos(1392,
                            this.loadProvincias(1392, 1393,
                                this.loadDistrito(1392, 1393, 1394)
                            )
                        );
                        if(isNaN(parseInt(value))){
                            form.setRecord(Ext.create('rewpos.model.Cliente',{id: null, nombre: value}));
                        }else{
                            form.setRecord(Ext.create('rewpos.model.Cliente',{id: null, ruc: value}));
                        }
                    }
                },
                scope: this
            });
        } else {
            Ext.Viewport.remove(field.up('panel'));
            Ext.Viewport.add({xtype: 'clienteModal', scrollable: false});
        }
    },
    onSearchClearIconTap2: function(field) {
        Ext.getStore('Cliente').removeAll();
        field.focus()
    },
    onItemDoubleTapClienteList: function(item, index, target, record) {
        this.updateCliente(item,  record.get('id'), record);
    },
    onFocusBuscar: function() {
        rewpos.AppGlobals.LIST_SELECTED = null;
    }
});