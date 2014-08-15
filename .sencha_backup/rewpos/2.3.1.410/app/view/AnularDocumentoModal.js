Ext.define('rewpos.view.AnularDocumentoModal', {
    extend: 'Ext.Panel',
    xtype: 'anularDocumentoModal',
    config: {
        cls: 'modal',
        centered: true,
        width: 600,
        //height: 500,
        hideOnMaskTap: true,
        modal: true,
        items: [{
            xtype: 'label',
            html: 'Anular Documento',
            cls: 'titulo-modal'
        },{
            xtype: 'searchfield',
            label: 'Documento/Cliente',
            labelWidth: 160,
            name: 'buscar'
        },{
            xtype: 'list',
            height: 300,
            store: 'Venta',
            itemTpl: new Ext.XTemplate(
                '<tpl if="anulado">',
                    '<div class="documentos-row-list anulado">',
                '<tpl else>',
                    '<div class="documentos-row-list">',
                '</tpl>',
                    '<div class="field-left">{fecha}</div>',
                    '<div class="field-left">{documento}</div>',
                    '<div>{cliente}</div>',
                '</div>'
            )
        },{
            xtype: 'textfield',
            label: 'Observacion',
            labelWidth: 160,
            name: 'observacion'
        },{
            layout: {
                type: 'hbox'
            },
            defaults: {
                xtype: 'button',
                flex: 1
            },
            height: 65,
            items: [{
                name: 'btnAnular',
                text: 'ANULAR',
                cls: 'btn_editar'
            },{
                name: 'btnCancelar',
                text: 'CANCELAR',
                cls: 'btn_eliminar'
            }]
        }]
    }
});