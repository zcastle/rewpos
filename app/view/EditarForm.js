Ext.define('rewpos.view.EditarForm', {
	extend: 'Ext.form.Panel',
    xtype: 'editarForm',
    config: {
        items: [{
            xtype: 'fieldset',
            defaults: {
                xtype: 'textfield',
                labelWidth: 110
            },
            items: [{
                name: 'producto_name'
            },{
                xtype: 'spinnerfield',
                label: 'CANTIDAD',
                name: 'cantidad',
                minValue: 1,
                stepValue: 1,
                component: {
                    disabled: true
                }
            },{
                xtype: 'container', 
                layout: 'hbox', 
                items: [{
                    xtype: 'spinnerfield',
                    name: 'precio',
                    minValue: 0.1,
                    stepValue: 0.5,
                    labelWidth: 110,
                    label: 'PRECIO', 
                    flex: 1,
                    component: {
                        disabled: true
                    }
                }, {
                    xtype: 'button',
                    name: 'btnTecladoCantidad',
                    iconCls: 'ico_teclado'
                }]
            },{
                xtype: 'textareafield',
                name: 'mensaje',
                placeHolder: 'MENSAJE'/*,
                maxHeight: 60*/
            },{
                xtype: 'multiselectfield',
                name: 'hijos',
                label: 'Combo',
                labelWidth: 80,
                value: '',
                //placeHolder: 'Seleccionar',
                //delimiter: ',', 
                //mode: 'SINGLE', // default is MULTI,
                // value: ['first','second'] , init value with an array
                // value: 'first,second', init value with a string
                /*options: [
                    {text: 'First Option',  value: 'first'},
                    {text: 'Second Option', value: 'second'},
                    {text: 'Third Option',  value: 'third'}
                ]*/
                store: 'Hijo',
                valueField : 'id',
                displayField : 'nombre'
            }/*,{
                xtype: 'container',
                defaults: {
                    cls: "check-combo",
                    labelWidth: '70%',
                    labelWrap: true
                },
                items: [{
                    xtype: 'checkboxfield',
                    label: 'Tomato'
                }, {
                    xtype: 'checkboxfield',
                    label: 'Tomato'
                }, {
                    xtype: 'checkboxfield',
                    label: 'Tomato'
                },{
                    xtype: 'checkboxfield',
                    label: 'Tomato'
                }, {
                    xtype: 'checkboxfield',
                    label: 'Tomato'
                }, {
                    xtype: 'checkboxfield',
                    label: 'Tomato'
                }]
            }*/]
        }/*,{
            xtype: 'dataview',
            id: 'dataViewHijo',
            store: 'Hijo',
            inline: true,
            //height: "100%",
            itemTpl: new Ext.XTemplate(
                '<tpl if="this.isChecked(check)">',
                    '<div class="hijo ocupada">',
                '<tpl else>',
                    '<div class="hijo libre">',
                '</tpl>',
                '{nombre}</div>',
                {
                    disableFormats: true,
                    isChecked: function(check){
                       return check == true;
                    }
                }
            )
        }*/,{
            layout: {
                type: 'hbox'
            },
            defaults: {
                xtype: 'button',
                flex: 1
            },
            height: 65,
            items: [{
                name: 'btnEditar',
                iconCls: 'ico_editar',
                cls: 'btn_editar'
            },{
                name: 'btnEliminar',
                iconCls: 'ico_eliminar',
                cls: 'btn_eliminar'
            }]
        }]
    }
});